import english from "template/languages/en_US.ts";
import korean from "template/languages/ko_KR.ts";

const languages: Record<string, Language> = {
  english,
  korean
};

export default languages;

export type Language = Record<
  string,
  // deno-lint-ignore no-explicit-any
  string | string[] | ((...args: any[]) => string)
>;
