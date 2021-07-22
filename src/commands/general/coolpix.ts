import { DiscordApplicationCommandOptionTypes } from "../../../deps";
import translate from "../../languages/translate";
import { Embed } from "../../utils/Embed";
import { Command } from "../mod";

const command: Command = {
  global: true,
  options: [
    /*{
      required: false,
      name: "AVATAR_USER_NAME",
      description: "AVATAR_USER_DESCRIPTION",
      type: DiscordApplicationCommandOptionTypes.User,
    },*/
  ],
  execute: function (payload) {
    const arg = payload.data?.options?.[0];
    const userId = (arg?.value || "") as string;
    const targetUser =
      payload.data?.resolved?.users?.[userId] ||
      payload.member?.user ||
      payload.user!;

    const embed = new Embed()
      .setAuthor(
        `${targetUser.username}#${targetUser?.discriminator}`,
        targetUser
      )
      .setImage(targetUser);

    return { embeds: [embed] };
  }
};

export default command;
