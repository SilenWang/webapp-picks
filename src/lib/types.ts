export type Locale = 'en' | 'zh';

export interface LocalizedString {
  en: string;
  zh: string;
}

export type Category = string;

export interface CategoryConfig {
  id: string;
  name: LocalizedString;
  icon: string;
  description: LocalizedString;
}

export interface CategoriesData {
  categories: CategoryConfig[];
}

export interface WebApp {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  review?: LocalizedString;
  url: string;
  icon: string;
  screenshot?: string;
  pwaSupported: boolean;
  selfhosted: boolean;
  selfhostUrl?: string;
  dockerImage?: string;
  category?: Category;
  categories: Category[];
  tags: string[];
  developer: string;
  license?: string;
  githubStars?: number;
  lastUpdated: string;
}

export interface Dictionary {
  header: {
    title: string;
    search: string;
    language: string;
    theme: string;
    themeLight: string;
    themeDark: string;
    themeAuto: string;
    about: string;
  };
  about?: {
    title: string;
    origin: string;
    originContent: string;
    criteria: string;
    criteriaContent: string;
    back: string;
  };
  filters: {
    all: string;
    category: string;
    pwaSupported: string;
    selfhosted: string;
    yes: string;
    no: string;
  };
  appCard: {
    openApp: string;
    pwa: string;
    selfhost: string;
  };
  detail: {
    overview: string;
    details: string;
    version: string;
    lastUpdated: string;
    developer: string;
    category: string;
    tags: string;
    license: string;
    pwaSupport: string;
    selfhosted: string;
    selfhostUrl: string;
    dockerImage: string;
    openApp: string;
  };
  noResults: string;
  footer: {
    description: string;
  };
}

export interface AppsData {
  apps: WebApp[];
}
