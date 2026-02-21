import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Locale, Category } from '@/lib/types';
import { filterApps, getCategories } from '@/lib/apps';
import { getDictionary } from '@/lib/i18n';
import { Header } from '@/components/Header';
import { AppGrid } from '@/components/AppGrid';
import { FilterBarClient } from '@/components/FilterBarClient';

interface PageProps {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{ 
    category?: string; 
    pwa?: string; 
    selfhosted?: string;
    search?: string;
  }>;
}

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export default async function HomePage({ params, searchParams }: PageProps) {
  const { lang } = await params;
  const resolvedSearchParams = await searchParams;
  
  if (!['zh', 'en'].includes(lang)) {
    notFound();
  }
  
  const dict = await getDictionary(lang);
  
  const selectedCategory = (resolvedSearchParams.category as Category | null) || null;
  const selectedPwa = resolvedSearchParams.pwa === 'true' ? true : resolvedSearchParams.pwa === 'false' ? false : null;
  const selectedSelfhosted = resolvedSearchParams.selfhosted === 'true' ? true : resolvedSearchParams.selfhosted === 'false' ? false : null;
  const searchQuery = resolvedSearchParams.search || '';
  
  const filteredApps = filterApps(lang, {
    category: selectedCategory || undefined,
    pwaSupported: selectedPwa !== null ? selectedPwa : undefined,
    selfhosted: selectedSelfhosted !== null ? selectedSelfhosted : undefined,
    search: searchQuery || undefined,
  });
  
  const categories = getCategories();
  
  return (
    <div className="min-h-screen">
      <Suspense fallback={<div className="h-16 border-b bg-background" />}>
        <Header 
          locale={lang}
          dict={dict}
        />
      </Suspense>
      
      <FilterBarClient 
        locale={lang}
        dict={dict}
        categories={categories}
        initialCategory={selectedCategory}
        initialPwa={selectedPwa}
        initialSelfhosted={selectedSelfhosted}
      />
      
      <div className="main-wrapper">
        <main className="main-content">
          {filteredApps.length > 0 ? (
            <div className="grid-container" style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              marginLeft: '8px', 
              marginRight: '8px',
              marginBottom: '16px',
              justifyContent: 'space-around',
              backgroundColor: 'var(--background)'
            }}>
              {filteredApps.map((app) => (
                <a
                  key={app.id}
                  href={`/${lang}/app/${app.id}`}
                  className="app-card"
                  style={{ 
                    width: '100%', 
                    maxWidth: '345px',
                    margin: '4px'
                  }}
                >
                  <div className="app-icon">
                    <img src={app.icon} alt={app.name[lang]} />
                  </div>
                  <div className="app-info">
                    <div className="app-name">{app.name[lang]}</div>
                    <div className="app-desc">{app.description[lang]}</div>
                  </div>
                  <div className="app-tags">
                    {app.pwaSupported && (
                      <span className="tag">PWA</span>
                    )}
                    {app.selfhosted && (
                      <span className="tag">Self</span>
                    )}
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '64px 16px',
              color: 'var(--muted-foreground)'
            }}>
              <p style={{ fontSize: '18px' }}>{dict.noResults}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
