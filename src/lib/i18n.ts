import { Locale } from "./types";
import YAML from "yaml";
import fs from "fs";
import path from "path";

let cachedDictionaries: Record<Locale, Record<string, unknown>> | null = null;

function loadDictionaries(): Record<Locale, Record<string, unknown>> {
  if (cachedDictionaries) {
    return cachedDictionaries;
  }

  const dictionaries: Record<Locale, Record<string, unknown>> = {
    en: {},
    zh: {},
  };

  const locales: Locale[] = ["en", "zh"];

  for (const locale of locales) {
    const filePath = path.join(
      process.cwd(),
      "src",
      "data",
      "dictionaries",
      `${locale}.yaml`
    );
    const fileContents = fs.readFileSync(filePath, "utf8");
    dictionaries[locale] = YAML.parse(fileContents) as Record<string, unknown>;
  }

  cachedDictionaries = dictionaries;
  return cachedDictionaries;
}

export function getDictionary(locale: Locale): Record<string, unknown> {
  const dictionaries = loadDictionaries();
  return dictionaries[locale];
}
