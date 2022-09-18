import {
  InteractionApplicationCommandCallbackData,
} from "../../deps.ts";

import {
  InteractionResponse
} from "discordeno/mod.ts";

export function isInteractionResponse(
  response: InteractionResponse | InteractionApplicationCommandCallbackData,
): response is InteractionResponse {
  return Reflect.has(response, "type");
}
