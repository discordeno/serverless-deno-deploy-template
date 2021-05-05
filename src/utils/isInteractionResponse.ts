import {
  InteractionApplicationCommandCallbackData,
  InteractionResponse,
} from "../../deps.ts";

export function isInteractionResponse(
  response: InteractionResponse | InteractionApplicationCommandCallbackData,
): response is InteractionResponse {
  return Reflect.has(response, "type");
}
