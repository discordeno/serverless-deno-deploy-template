import {
  Interaction,
  InteractionResponse,
  InteractionResponseTypes,
  InteractionTypes,
  json,
  serve,
  SnakeCasedPropertiesDeep,
  validateRequest,
  verifySignature,
} from "./deps.ts";

serve({
  "/": main,
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

  const payload: SnakeCasedPropertiesDeep<Interaction> = JSON.parse(body);
  if (payload.type === InteractionTypes.Ping) {
    return json({
      type: InteractionResponseTypes.Pong,
    });
  } else if (payload.type === InteractionTypes.ApplicationCommand) {
    return json( {
      type: InteractionResponseTypes.ChannelMessageWithSource,
      data: {
        content: "Hello, world!",
      },
    });
  }

  return json({ error: "Bad request" }, { status: 400 });
}
