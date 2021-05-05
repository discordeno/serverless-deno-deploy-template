import { json, upsertSlashCommands } from "../../deps.ts";
import { commands } from "../commands/mod.ts";
import translate from "../languages/translate.ts";

export default async function redeploy(request: Request) {
  console.log("inside redeploy", 1);
  const authorization = request.headers.get("authorization");
  if (
    !authorization || (authorization !== Deno.env.get("REDEPLOY_AUTHORIZATION"))
  ) {
    console.log("inside redeploy", 2);
    return json({ error: "Invalid authorization header." }, { status: 401 });
  }

  console.log("inside redeploy", 3);
  await updateGlobalCommands();
  console.log("inside redeploy", 4);
  return json({ success: true });
}

export async function updateGlobalCommands() {
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
