import { Interaction, validatePermissions } from "../../deps.ts";
import { Command } from "../commands/mod.ts";

export default async function hasPermissionLevel(command: Command, payload: Interaction) {
    // This command doesnt require a perm level so allow the command.
  if (!command.permissionLevels) return true;

  // If a custom function was provided
  if (typeof command.permissionLevels === "function") {
    return await command.permissionLevels(payload, command);
  }

  // If an array of perm levels was provided
  for (const permlevel of command.permissionLevels) {
    // If this user has one of the allowed perm level, the loop is canceled and command is allowed.
    if (await PermissionLevelHandlers[permlevel](payload, command)) return true;
  }

  // None of the perm levels were met. So cancel the command
  return false;
}

export const PermissionLevelHandlers: Record<
  string,
  (payload: Interaction, command: Command) => boolean | Promise<boolean>
> = {
  MEMBER: () => true,
  MODERATOR: (payload) => Boolean(payload.member?.permissions) &&
  validatePermissions(payload.member!.permissions, ["MANAGE_GUILD"]),
  ADMIN: (payload) =>
    Boolean(payload.member?.permissions) &&
    validatePermissions(payload.member!.permissions, ["ADMINISTRATOR"]),
  // TODO: Add your user id here and anyone else you want to give access to.
  BOT_OWNERS: (payload) => [""].includes(payload.member?.user.id || payload.user?.id!),
};

export enum PermissionLevels {
  MEMBER,
  MODERATOR,
  ADMIN,
  SERVER_OWNER,
  BOT_SUPPORT,
  BOT_DEVS,
  BOT_OWNER,
}