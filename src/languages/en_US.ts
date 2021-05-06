import { Language } from "./mod.ts";

const english: Language = {
  // COMMON STRINGS

  MISSING_MEMBER: "No member was found.",
  MISSING_PERM_LEVEL: "You do not have the necessary permissions to use this command.",
  
  // COMMANDS STRINGS

  // Avatar Command
  AVATAR_NAME: "avatar",
  AVATAR_DESCRIPTION: "Shows the avatar of a user or yourself.",
  AVATAR_USER_NAME: "user",
  AVATAR_USER_DESCRIPTION: "Provide a @user to view their avatar.",

  // Language Command
  LANGUAGE_NAME: "language",
  LANGUAGE_DESCRIPTION: "Change the bots language.",
  LANGUAGE_KEY_NAME: "name",
  LANGUAGE_KEY_DESCRIPTION: "What language would you like to set?",
  LANGUAGE_MISSING_KEY: "No language was provided.",
  LANGUAGE_INVALID_KEY: (languages: string[]) =>
    `I could not find a language with that name. Valid languages are: ${
      languages.join(" ")
    }`,
  LANGUAGE_UPDATED: (language: string) =>
    `The language has been updated to ${language}`,

  // Ping Command
  PING_NAME: "ping",
  PING_DESCRIPTION: "Check whether the bot is online and responsive.",
  PING_RESPONSE: "Pong! Discordeno Best Lib!",
};

export default english;
