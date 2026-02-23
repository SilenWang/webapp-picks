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
  url: string;
  icon: string;
  screenshot?: string;
  pwaSupported: boolean;
  selfhosted: boolean;
  selfhostUrl?: string;
  dockerImage?: string;
  category: Category;
  tags: string[];
  developer: string;
  license?: string;
  githubStars?: number;
  lastUpdated: string;
}

export interface AppsData {
  apps: WebApp[];
}
