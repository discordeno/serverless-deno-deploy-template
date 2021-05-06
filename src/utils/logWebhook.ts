import {
  avatarURL,
  Interaction,
  sendWebhook,
  snowflakeToBigint,
} from "../../deps.ts";

export async function logWebhook(payload: Interaction) {
  const webhook = Deno.env.get("DISCORD_LOGS_WEBHOOK");
  if (webhook) {
    const [id, token] = webhook.substring(webhook.indexOf("webhooks/") + 9)
      .split("/");
    const user = payload.member?.user || payload.user!;

    await sendWebhook(snowflakeToBigint(id), token, {
      embeds: [
        {
          author: {
            name:
              `${user.username}#${user.discriminator} used ${payload.data!.name}`,
            iconUrl: avatarURL(
              snowflakeToBigint(user.id),
              snowflakeToBigint(user.discriminator),
              user.avatar,
            ),
          },
          fields: [
            {
              name: "Channel",
              value: payload.channelId || "Channel ID unavailable",
              inline: true,
            },
            {
              name: "Guild",
              value: payload.guildId || "Guild ID Unavailable",
              inline: true,
            },
          ],
        },
      ],
    });
  }
}
