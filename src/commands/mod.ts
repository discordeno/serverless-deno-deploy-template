import {
  ApplicationCommandOption,
  Interaction,
  InteractionApplicationCommandCallbackData,
  InteractionResponse
} from "../../deps";
import ping from "./general/ping";
import avatar from "./general/avatar";
import language from "./general/language";
import coolpix from "./general/coolpix";
import { PermissionLevels } from "../utils/permissionLevels";

export const commands: Record<string, Command | undefined> = {
  ping,
  avatar,
  language,
  coolpix
};

export interface Command {
  /** The permissions levels that are allowed to use this command. */
  permissionLevels?:
    | ((payload: Interaction, command: Command) => boolean | Promise<boolean>)
    | (keyof typeof PermissionLevels)[];
  /** The description of the command. Can be a i18n key if you use advanced version. */
  description?: string;
  /** Whether or not this slash command should be enabled right now. Defaults to true. */
  enabled?: boolean;
  /** Whether this slash command should be created per guild. Defaults to true. */
  guild?: boolean;
  /** Whether this slash command should be created once globally and allowed in DMs. Defaults to false. */
  global?: boolean;
  /** Whether or not to use the Advanced mode. Defaults to true. */
  advanced?: boolean;
  /** The slash command options for this command. */
  options?: ApplicationCommandOption[];
  /** The function that will be called when the command is executed. */
  execute: (
    payload: Interaction
  ) =>
    | InteractionResponse
    | InteractionApplicationCommandCallbackData
    | Promise<InteractionResponse | InteractionApplicationCommandCallbackData>;
}
