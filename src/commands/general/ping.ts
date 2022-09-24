import { translate } from "template/languages/mod.ts";
import { Command } from "template/commands/mod.ts";

export const ping: Command = {
  global: true,
  execute: function (payload) {
    return { content: translate(payload.guildId!.toString(), "PING_RESPONSE") };
  },
};