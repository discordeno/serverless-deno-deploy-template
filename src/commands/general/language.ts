import {
  DiscordApplicationCommandOptionTypes,
  upsertSlashCommands,
} from "../../../deps.ts";
import { Command, commands } from "../mod.ts";
import languages from "../../languages/mod.ts";
import translate from "../../languages/translate.ts";

const command: Command = {
  description: "Change the bots language.",
  options: [
    {
      required: true,
      name: "LANGUAGE_KEY_NAME",
      description: "LANGUAGE_KEY_DESCRIPTION",
      type: DiscordApplicationCommandOptionTypes.String,
    },
  ],
  execute: async function (payload) {
    const arg = payload.data?.options?.[0];
    const value = (arg?.value || "") as string;
    if (!value) {
      return { content: translate(payload.guildId!, "LANGUAGE_MISSING_KEY") };
    }

    if (!languages[value]) {
      return {
        content: translate(
          payload.guildId!,
          "LANGUAGE_INVALID_KEY",
          Object.keys(languages),
        ),
      };
    }

    // Set the language to the commands on this server.

    await upsertSlashCommands(
      Object.entries(commands).map(([name, command]) => {
        // USER OPTED TO USE BASIC VERSION ONLY
        if (command!.advanced === false) {
          return {
            name,
            description: command!.description || "No description available.",
            options: command!.options,
          };
        }

        // ADVANCED VERSION WILL ALLOW TRANSLATION
        const translatedName = translate(
          payload.guildId!,
          `${name.toUpperCase()}_NAME`,
        );
        const translatedDescription = translate(
          payload.guildId!,
          `${name.toUpperCase()}_DESCRIPTION`,
        );

        return {
          name: translatedName || name,
          description: translatedDescription || command!.description,
          options: command!.options?.map((option) => {
            const optionName = translate(payload.guildId!, option.name);
            const optionDescription = translate(
              payload.guildId!,
              option.description,
            );

            return {
              ...option,
              name: optionName,
              description: optionDescription || "No description available.",
            };
          }),
        };
      }),
    );

    return {
      content: translate(payload.guildId!, "LANGUAGE_UPDATED"),
    };
  },
};

export default command;
