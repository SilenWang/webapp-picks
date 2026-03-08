import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Locale, Category } from '@/lib/types';
import { filterApps, getCategories } from '@/lib/apps';
import { getDictionary } from '@/lib/i18n';
import { Header } from '@/components/Header';
import { FilterBarClient } from '@/components/FilterBarClient';
import { AppList } from '@/components/AppList';
import { BottomBar } from '@/components/BottomBar';

const BASE_URL = "https://webapp-picks.cc";

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  
  const titles: Record<Locale, string> = {
    zh: "Webapp Picks",
    en: "Webapp Picks",
  };
  
  const descriptions: Record<Locale, string> = {
    zh: "发现并安装适用于 FydeOS 的实用网页应用。涵盖新闻、工具、生产力等多种分类。",
    en: "Discover and install useful webapps for FydeOS. Covering news, tools, productivity and more.",
  };
  
  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: {
      canonical: `${BASE_URL}/${lang}`,
      languages: {
        en: `${BASE_URL}/en`,
        zh: `${BASE_URL}/zh`,
      },
    },
    openGraph: {
      title: titles[lang],
      description: descriptions[lang],
      url: `${BASE_URL}/${lang}`,
    },
  };
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
