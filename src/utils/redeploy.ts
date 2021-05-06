import {
  decode,
  json,
  rest,
  setApplicationId,
  upsertSlashCommands,
} from "../../deps.ts";
import { commands } from "../commands/mod.ts";
import translate from "../languages/translate.ts";

export default async function redeploy(request: Request) {
  const authorization = request.headers.get("authorization");
  if (
    !authorization || (authorization !== Deno.env.get("REDEPLOY_AUTHORIZATION"))
  ) {
    return json({ error: "Invalid authorization header." }, { status: 401 });
  }

  await updateGlobalCommands();
  return json({ success: true });
}

export async function updateGlobalCommands() {
  const token = Deno.env.get("DISCORD_TOKEN");
  rest.token = `Bot ${token}`;
  setApplicationId(
    new TextDecoder().decode(decode(token?.split(".")[0] || "")) || "",
  );

  // UPDATE GLOBAL COMMANDS
  await upsertSlashCommands(
    Object.entries(commands)
      // ONLY GLOBAL COMMANDS
      .filter(([_name, command]) => command?.global).map(
        ([name, command]) => {
          const description = translate(
            "english",
            `${name.toUpperCase()}_DESCRIPTION`,
          );

          return {
            name,
            description: command!.description || description ||
              "No description available.",
            options: command!.options?.map((option) => {
              const optionName = translate("english", option.name);
              const optionDescription = translate(
                "english",
                option.description,
              );

              return {
                ...option,
                name: optionName,
                description: optionDescription || "No description available.",
              };
            }),
          };
        },
      ),
  );
}

export async function updateGuildCommands(guildId: string) {
  // GUILD RELATED COMMANDS
  await upsertSlashCommands(
    Object.entries(commands)
      // ONLY GUILD COMMANDS
      .filter(([_name, command]) => command!.guild !== false).map(
        ([name, command]) => {
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
            guildId,
            `${name.toUpperCase()}_NAME`,
          );
          const translatedDescription = translate(
            guildId,
            `${name.toUpperCase()}_DESCRIPTION`,
          );

          return {
            name: translatedName || name,
            description: translatedDescription || command!.description,
            options: command!.options?.map((option) => {
              const optionName = translate(guildId, option.name);
              const optionDescription = translate(
                guildId,
                option.description,
              );

              return {
                ...option,
                name: optionName,
                description: optionDescription || "No description available.",
              };
            }),
          };
        },
      ),
  );
}
