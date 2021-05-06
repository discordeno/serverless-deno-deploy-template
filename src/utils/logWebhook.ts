import {
  Interaction,
  sendWebhook,
  snowflakeToBigint,
} from "../../deps.ts";
import { Embed } from "./Embed.ts";

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
    ).addField("Channel", payload.channelId || "Channel ID unavailable", true)
    .addField("Guild", payload.guildId || "Guild ID unavailable", true);

  await sendWebhook(snowflakeToBigint(id), token, {
    embeds: [embed],
  });
}
