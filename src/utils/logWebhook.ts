import {
  sendWebhook,
} from "../../deps.ts";

import {
  Interaction,
  snowflakeToBigint
} from "discordeno/mod.ts";

import { Embed } from "template/utils/mod.ts";

export async function logWebhook(payload: Interaction) {
  const webhook = Deno.env.get("DISCORD_LOGS_WEBHOOK");
  if (!webhook) return;
  const [id, token] = webhook.substring(webhook.indexOf("webhooks/") + 9)
    .split("/");
  const user = payload.member?.user || payload.user!;

  const embed = new Embed()
    .setAuthor(
      `${user.username}#${user.discriminator} used ${payload.data!.name}`,
      user,
    ).addField("Channel", payload.channelId?.toString() || "Channel ID unavailable", true)
    .addField("Guild", payload.guildId?.toString() || "Guild ID unavailable", true);

  await sendWebhook(snowflakeToBigint(id), token, {
    embeds: [embed],
  });
}
