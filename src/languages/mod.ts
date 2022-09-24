import english from "template/languages/en_US.ts";
import korean from "template/languages/ko_KR.ts";

export const languages: Record<string, Language> = {
  english,
  korean
};

export type Language = Record<
  string,
  // deno-lint-ignore no-explicit-any
  string | string[] | ((...args: any[]) => string)
>;

export { translate } from "template/languages/translate.ts";