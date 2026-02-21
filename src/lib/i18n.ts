import { Locale } from './types';

export async function getDictionary(locale: Locale) {
  try {
    const modules = await Promise.all([
      import('../data/dictionaries/en.json'),
      import('../data/dictionaries/zh.json'),
    ]);
    
    const dictionaries: Record<Locale, any> = {
      en: modules[0].default,
      zh: modules[1].default,
    };
    
    return dictionaries[locale];
  } catch (error) {
    console.error('Failed to load dictionary:', error);
    return {};
  }
}
