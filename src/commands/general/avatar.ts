import {
  avatarURL,
  DiscordApplicationCommandOptionTypes,
  snowflakeToBigint,
} from "../../../deps.ts";
import translate from "../../languages/translate.ts";
import { Command } from "../mod.ts";

const command: Command = {
  options: [
    {
      required: false,
      name: "AVATAR_USER_NAME",
      description: "AVATAR_USER_DESCRIPTION",
      type: DiscordApplicationCommandOptionTypes.User,
    },
  ],
  execute: function (payload) {
    const arg = payload.data?.options?.[0];
    const userId = (arg?.value || "") as string;

    if (arg?.value) {
      const targetUser = payload.data?.resolved?.users?.[userId];
      if (!targetUser) return { content: translate(payload.guildId!, "MISSING_MEMBER") };

      const url = avatarURL(
        snowflakeToBigint(targetUser.id),
        snowflakeToBigint(targetUser.discriminator),
        targetUser.avatar,
        2048,
      );

      return {
        embeds: [
          {
            author: {
              name: `${targetUser.username}#${targetUser?.discriminator}`,
              iconUrl: url,
            },
            image: {
              url,
            },
          },
        ],
      };
    }

    if (!payload.member) return { content: translate(payload.guildId!, "MISSING_MEMBER") };

    return {
      embeds: [
        {
          author: {
            name:
              `${payload.member.user.username}#${payload.member.user.discriminator}`,
            iconUrl: avatarURL(
              snowflakeToBigint(payload.member.user.id),
              snowflakeToBigint(payload.member.user.discriminator),
              payload.member.user.avatar,
            ),
          },
          image: {
            url: avatarURL(
              snowflakeToBigint(payload.member.user.id),
              snowflakeToBigint(payload.member.user.discriminator),
              payload.member.user.avatar,
              2048,
            ),
          },
        },
      ],
    };
  },
};

export default command;
