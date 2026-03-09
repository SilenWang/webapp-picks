'use client';

import { useState } from 'react';
import { WebApp, Locale } from '@/lib/types';
import { AppDialog } from './AppDialog';

interface AppListProps {
  apps: WebApp[];
  locale: Locale;
  dict: {
    appCard: {
      openApp: string;
      pwa: string;
      selfhost: string;
    };
    detail: {
      openApp: string;
      details: string;
      category: string;
      developer: string;
      lastUpdated: string;
      license: string;
      dockerImage: string;
      tags: string;
    };
    noResults: string;
  };
  categories: { value: string; label: { en: string; zh: string } }[];
}

export function AppList({ apps, locale, dict, categories }: AppListProps) {
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  
  const selectedApp = selectedAppId ? apps.find(app => app.id === selectedAppId) : null;
  const categoryLabels = selectedApp 
    ? selectedApp.categories.map(cat => categories.find(c => c.value === cat)?.label[locale] || cat)
    : [];

  if (apps.length === 0) {
    return (
      <div className="empty-state">
        <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9.172 14.828L12 12m0 0l2.828-2.828M12 12l2.828 2.828M12 12L9.172 9.172M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <p className="empty-state-text">{dict.noResults}</p>
      </div>
    );
  }

  return (
    <>
      <div className="app-grid">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => setSelectedAppId(app.id)}
            className="app-card"
          >
            <div className="app-card-header">
              <div className="app-icon">
                <img src={app.icon} alt={app.name[locale]} />
              </div>
              <div className="app-info">
                <div className="app-name">{app.name[locale]}</div>
                <div className="app-desc">{app.description[locale]}</div>
              </div>
            </div>
            <div className="app-card-footer">
              <div className="app-tags">
                {app.pwaSupported && (
                  <span className="tag tag-pwa">PWA</span>
                )}
                {app.selfhosted && (
                  <span className="tag tag-self">Self</span>
                )}
              </div>
              <span className="app-category">
                {app.categories.map(cat => categories.find(c => c.value === cat)?.label[locale] || cat).join(', ')}
              </span>
            </div>
          </button>
        ))}
      </div>

      {selectedApp && (
        <AppDialog 
          app={selectedApp}
          locale={locale}
          dict={dict}
          categoryLabels={categoryLabels}
          onClose={() => setSelectedAppId(null)}
        />
      )}
    </>
  );
}
