import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Locale, Category } from '@/lib/types';
import { filterApps, getCategories } from '@/lib/apps';
import { getDictionary } from '@/lib/i18n';
import { Header } from '@/components/Header';
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
      
      <div className="main-wrapper">
        <FilterBarClient 
          locale={lang}
          dict={dict}
          categories={categories}
          initialCategory={selectedCategory}
          initialPwa={selectedPwa}
          initialSelfhosted={selectedSelfhosted}
        />
        
        <main className="main-content">
          {filteredApps.length > 0 ? (
            <div className="app-grid">
              {filteredApps.map((app) => (
                <a
                  key={app.id}
                  href={`/${lang}/app/${app.id}`}
                  className="app-card"
                >
                  <div className="app-card-header">
                    <div className="app-icon">
                      <img src={app.icon} alt={app.name[lang]} />
                    </div>
                    <div className="app-info">
                      <div className="app-name">{app.name[lang]}</div>
                      <div className="app-desc">{app.description[lang]}</div>
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
                      {categories.find(c => c.value === app.category)?.label[lang] || app.category}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9.172 14.828L12 12m0 0l2.828-2.828M12 12l2.828 2.828M12 12L9.172 9.172M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="empty-state-text">{dict.noResults}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
