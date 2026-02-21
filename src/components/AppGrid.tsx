import { WebApp, Locale } from '@/lib/types';
import { AppCard } from './AppCard';

interface AppGridProps {
  apps: WebApp[];
  locale: Locale;
  dict: {
    appCard: {
      openApp: string;
      pwa: string;
      selfhost: string;
    };
  };
}

export function AppGrid({ apps, locale, dict }: AppGridProps) {
  if (apps.length === 0) {
    return null;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {apps.map((app) => (
        <AppCard 
          key={app.id} 
          app={app} 
          locale={locale}
          dict={dict}
        />
      ))}
    </div>
  );
}
