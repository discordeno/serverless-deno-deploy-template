import translate from "../../languages/translate.ts";
import { Command } from "../mod.ts";

const command: Command = {
  global: true,
  execute: function (payload) {
    return { content: translate(payload.guildId!, "PING_RESPONSE") };
  },
};

export default command;
