import { Locale, Dictionary } from "./types";
import YAML from "yaml";
import fs from "fs";
import path from "path";

let cachedDictionaries: Record<Locale, Dictionary> | null = null;

function loadDictionaries(): Record<Locale, Dictionary> {
  if (cachedDictionaries) {
    return cachedDictionaries;
  }

  const dictionaries: Record<Locale, Dictionary> = {
    en: {} as Dictionary,
    zh: {} as Dictionary,
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
    dictionaries[locale] = YAML.parse(fileContents) as Dictionary;
  }

  cachedDictionaries = dictionaries;
  return cachedDictionaries;
}

export function getDictionary(locale: Locale): Dictionary {
  const dictionaries = loadDictionaries();
  return dictionaries[locale];
}
