import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Locale, Category } from '@/lib/types';
import { filterApps, getCategories } from '@/lib/apps';
import { getDictionary } from '@/lib/i18n';
import { Header } from '@/components/Header';
import { FilterBarClient } from '@/components/FilterBarClient';
import { AppList } from '@/components/AppList';
import { BottomBar } from '@/components/BottomBar';

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
          <AppList 
            apps={filteredApps}
            locale={lang}
            dict={dict}
            categories={categories}
          />
        </main>
        
        <BottomBar />
      </div>
    </div>
  );
}
