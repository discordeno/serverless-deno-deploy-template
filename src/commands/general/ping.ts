import translate from "../../languages/translate.ts";
import { Command } from "../mod.ts";

const command: Command = {
  execute: function (payload) {
    return { content: translate(payload.guildId!, "ping", "PING_RESPONSE") };
  },
};

export default command;
