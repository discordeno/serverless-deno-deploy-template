import translate from "template/languages/translate.ts";
import { Command } from "template/commands/mod.ts";

const command: Command = {
  global: true,
  execute: function (payload) {
    return { content: translate(payload.guildId!, "PING_RESPONSE") };
  },
};

export default command;
