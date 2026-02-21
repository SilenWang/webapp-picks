import { WebApp, Locale, Category } from './types';
import { apps } from '@/data/apps';

export function getAllApps(): WebApp[] {
  return apps;
}

export function getAppById(id: string): WebApp | undefined {
  return apps.find(app => app.id === id);
}

export function getAppsByCategory(category: Category): WebApp[] {
  return apps.filter(app => app.category === category);
}

export function searchApps(query: string, locale: Locale): WebApp[] {
  const lowerQuery = query.toLowerCase();
  return apps.filter(app => 
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
  let result = apps;
  
  if (options.category) {
    result = result.filter(app => app.category === options.category);
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

export function getCategories(): { value: Category; label: { en: string; zh: string } }[] {
  return [
    { value: 'productivity', label: { en: 'Productivity', zh: '效率办公' } },
    { value: 'developer', label: { en: 'Developer Tools', zh: '开发工具' } },
    { value: 'media', label: { en: 'Media', zh: '多媒体' } },
    { value: 'social', label: { en: 'Social', zh: '社交' } },
    { value: 'tools', label: { en: 'Tools', zh: '工具' } },
    { value: 'education', label: { en: 'Education', zh: '教育' } },
    { value: 'entertainment', label: { en: 'Entertainment', zh: '娱乐' } },
    { value: 'shopping', label: { en: 'Shopping', zh: '购物' } },
  ];
}
