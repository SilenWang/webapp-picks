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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <Suspense fallback={<div className="h-16 border-b bg-background" />}>
        <Header 
          locale={lang}
          dict={dict}
        />
      </Suspense>
      
      <main className="flex-1 container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{dict.header.title}</h1>
          <p className="text-muted-foreground">{dict.footer.description}</p>
        </div>
        
        <div className="mb-8">
          <FilterBarClient 
            locale={lang}
            dict={dict}
            categories={categories}
            initialCategory={selectedCategory}
            initialPwa={selectedPwa}
            initialSelfhosted={selectedSelfhosted}
          />
        </div>
        
        {filteredApps.length > 0 ? (
          <AppGrid apps={filteredApps} locale={lang} dict={dict} />
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">{dict.noResults}</p>
          </div>
        )}
      </main>
      
      <footer className="border-t py-6">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          {dict.footer.description}
        </div>
      </footer>
    </div>
  );
}
