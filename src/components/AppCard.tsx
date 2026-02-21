import Link from 'next/link';
import { WebApp, Locale } from '@/lib/types';
import { ExternalLink, Download, Server } from 'lucide-react';

interface AppCardProps {
  app: WebApp;
  locale: Locale;
  dict: {
    appCard: {
      openApp: string;
      pwa: string;
      selfhost: string;
    };
  };
}

export function AppCard({ app, locale, dict }: AppCardProps) {
  return (
    <Link 
      href={`/${locale}/app/${app.id}`}
      className="group flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary/30"
    >
      <div className="flex items-start gap-4 p-4">
        <div className="h-14 w-14 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
          <img 
            src={app.icon} 
            alt={app.name[locale]}
            className="h-full w-full object-cover"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
            {app.name[locale]}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {app.description[locale]}
          </p>
          
          <div className="flex flex-wrap gap-1.5 mt-2">
            {app.pwaSupported && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                <Download className="h-3 w-3" />
                {dict.appCard.pwa}
              </span>
            )}
            {app.selfhosted && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                <Server className="h-3 w-3" />
                {dict.appCard.selfhost}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
