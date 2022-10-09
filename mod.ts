import {
  json,
  serve,
  validateRequest
} from "sift/mod.ts";
import { 
  Interaction,
  InteractionResponseTypes,
  InteractionTypes,
  verifySignature
} from "discordeno/mod.ts";
import { camelize } from 'https://deno.land/x/camelize@2.0.0/mod.ts';

import { commands } from "template/commands/mod.ts";
import { translate } from "template/languages/mod.ts";
import { 
  isInteractionResponse,
  logWebhook,
  hasPermissionLevel,
  redeploy
} from "template/utils/mod.ts";

serve({
  "/": main,
  "/redeploy": redeploy,
});

async function main(request: Request) {
  // Validate the incmoing request; whether or not, it includes
  // the specified headers that are sent by Discord.
  const { error } = await validateRequest(request, {
    POST: {
      headers: ["X-Signature-Ed25519", "X-Signature-Timestamp"],
    },
  });
  if (error) {
    return json({ error: error.message }, { status: error.status });
  }

  const publicKey = Deno.env.get("DISCORD_PUBLIC_KEY");
  if (!publicKey) {
    return json({
      error: "Missing Discord public key from environment variables.",
    });
  }

  const signature = request.headers.get("X-Signature-Ed25519")!;
  const timestamp = request.headers.get("X-Signature-Timestamp")!;

  const { body, isValid } = verifySignature({
    publicKey,
    signature,
    timestamp,
    body: await request.text(),
  });
  if (!isValid) {
    return json({ error: "Invalid request; could not verify the request" }, {
      status: 401,
    });
  }

  const payload = camelize<Interaction>(JSON.parse(body)) as Interaction;
  if (payload.type === InteractionTypes.Ping) {
    return json({
      type: InteractionResponseTypes.Pong,
    });
  } else if (payload.type === InteractionTypes.ApplicationCommand) {
    if (!payload.data?.name) {
      return json({
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          content:
            "Something went wrong. I was not able to find the command name in the payload sent by Discord.",
        },
      });
    }

    const command = commands[payload.data.name];
    if (!command) {
      return json({
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          content: "Something went wrong. I was not able to find this command.",
        },
      });
    }

    // Make sure the user has the permission to run this command.
    if (!(await hasPermissionLevel(command, payload))) {
      return json({
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          content: translate(
            // discordeno marks guildId as bigint, so need to convert it to string, else translate function throws error
            payload.guildId! as unknown as string,
            "MISSING_PERM_LEVEL",
          ),
        },
      });
    }

    const result = await command.execute(payload);
    if (!isInteractionResponse(result)) {
      await logWebhook(payload).catch(console.error);
      return json({
        data: result,
        type: InteractionResponseTypes.ChannelMessageWithSource,
      });
    }

    // DENO/TS BUG DOESNT LET US SEND A OBJECT WITHOUT THIS OVERRIDE
    return json(result as unknown as { [key: string]: unknown });
  }

  return json({ error: "Bad request" }, { status: 400 });
}
