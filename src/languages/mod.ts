import english from "./en_US.ts";

const languages: Record<string, Language> = {
  english,
};

export default languages;

export type Language = Record<
  string,
  // deno-lint-ignore no-explicit-any
  string | string[] | ((...args: any[]) => string)
>;
