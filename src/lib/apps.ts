import { WebApp, Locale, Category, CategoryConfig, CategoriesData } from './types';
import YAML from 'yaml';
import fs from 'fs';
import path from 'path';

let cachedApps: WebApp[] | null = null;
let cachedCategories: CategoryConfig[] | null = null;

function loadApps(): WebApp[] {
  if (cachedApps) {
    return cachedApps;
  }
  
  const appsDir = path.join(process.cwd(), 'src', 'data', 'apps');
  const files = fs.readdirSync(appsDir).filter(file => file.endsWith('.yaml') || file.endsWith('.yml'));
  
  const apps = files.map(file => {
    const filePath = path.join(appsDir, file);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return YAML.parse(fileContents) as WebApp;
  });
  
  cachedApps = apps;
  return cachedApps;
}

function loadCategories(): CategoryConfig[] {
  if (cachedCategories) {
    return cachedCategories;
  }
  
  const filePath = path.join(process.cwd(), 'src', 'data', 'categories.yaml');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = YAML.parse(fileContents) as CategoriesData;
  cachedCategories = data.categories;
  return cachedCategories;
}

export function getAllApps(): WebApp[] {
  return loadApps();
}

export function getAppById(id: string): WebApp | undefined {
  return loadApps().find(app => app.id === id);
}

export function getAppsByCategory(category: Category): WebApp[] {
  return loadApps().filter(app => app.categories.includes(category));
}

export function searchApps(query: string, locale: Locale): WebApp[] {
  const lowerQuery = query.toLowerCase();
  return loadApps().filter(app => 
    app.name[locale].toLowerCase().includes(lowerQuery) ||
    app.description[locale].toLowerCase().includes(lowerQuery) ||
    app.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

export function filterApps(
  locale: Locale,
  options: {
    category?: Category;
    pwaSupported?: boolean;
    selfhosted?: boolean;
    search?: string;
  }
): WebApp[] {
  let result = loadApps();
  
  if (options.category) {
    result = result.filter(app => app.categories.includes(options.category!));
  }
  
  if (options.pwaSupported !== undefined) {
    result = result.filter(app => app.pwaSupported === options.pwaSupported);
  }
  
  if (options.selfhosted !== undefined) {
    result = result.filter(app => app.selfhosted === options.selfhosted);
  }
  
  if (options.search) {
    const lowerQuery = options.search.toLowerCase();
    result = result.filter(app => 
      app.name[locale].toLowerCase().includes(lowerQuery) ||
      app.description[locale].toLowerCase().includes(lowerQuery) ||
      app.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }
  
  return result;
}

export function getCategories(): { value: string; label: { en: string; zh: string }; icon: string }[] {
  const categories = loadCategories();
  return categories.map(cat => ({
    value: cat.id,
    label: cat.name,
    icon: cat.icon,
  }));
}
