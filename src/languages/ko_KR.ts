import { Language } from "template/languages/mod.ts";

const korean: Language = {
  // COMMON STRINGS

  MISSING_MEMBER: "유저를 찾지 못했어요.",
  MISSING_PERM_LEVEL: "이 명령어를 사용하기에 알맞은 권한을 갖고 있지 않아요.",
  
  // COMMANDS STRINGS

  // Avatar Command
  AVATAR_NAME: "아바타",
  AVATAR_DESCRIPTION: "자신혹은 다른 유저의 아바타를 보여줘요.",
  AVATAR_USER_NAME: "사용자",
  AVATAR_USER_DESCRIPTION: "Provide a @user to view their avatar.", // I don't know what this function is.

  // Language Command
  LANGUAGE_NAME: "언어",
  LANGUAGE_DESCRIPTION: "봇의 언어를 변경할 수 있어요.",
  LANGUAGE_KEY_NAME: "명칭",
  LANGUAGE_KEY_DESCRIPTION: "어떤 언어로 변경할까요?",
  LANGUAGE_MISSING_KEY: "알맞은 번역이 존재하지 않아요.",
  LANGUAGE_INVALID_KEY: (languages: string[]) =>
    `해당 이름의 언어를 찾지 못했어요. 유효한 언어 목록: ${
      languages.join(" ")
    }`,
  LANGUAGE_UPDATED: (language: string) =>
    `언어가 ${language}로 변경됬어요.`,

  // Ping Command
  PING_NAME: "ping",
  PING_DESCRIPTION: "봇이 활성화되어있는지 체크할 수 있어요.",
  PING_RESPONSE: "Pong! Discordeno Best Lib!",
};

export default korean;
