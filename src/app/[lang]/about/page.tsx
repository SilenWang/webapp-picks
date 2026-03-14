import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Locale, Category } from '@/lib/types';
import { getCategories } from '@/lib/apps';
import { getDictionary } from '@/lib/i18n';
import { Header } from '@/components/Header';
import { FilterBarClient } from '@/components/FilterBarClient';
import { BottomBar } from '@/components/BottomBar';

const BASE_URL = "https://webapp-picks.cc";

interface PageProps {
  params: Promise<{ lang: Locale }>;
}

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  
  const titles: Record<Locale, string> = {
    zh: "关于 - Webapp Picks",
    en: "About - Webapp Picks",
  };
  
  const descriptions: Record<Locale, string> = {
    zh: "了解 Webapp Picks 的由来和收录标准",
    en: "Learn about the origin and selection criteria of Webapp Picks",
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Webapp Picks",
    url: BASE_URL,
    logo: `${BASE_URL}/og-image.png`,
    sameAs: [
      "https://github.com/sylenswong/webapp-picks",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "qiumin14@163.com",
    },
    founder: {
      "@type": "Person",
      name: "Sylens Wong",
    },
  };
  
  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: {
      canonical: `${BASE_URL}/${lang}/about`,
      languages: {
        en: `${BASE_URL}/en/about`,
        zh: `${BASE_URL}/zh/about`,
      },
    },
    openGraph: {
      title: titles[lang],
      description: descriptions[lang],
      url: `${BASE_URL}/${lang}/about`,
    },
    other: {
      "script:ld+json": JSON.stringify(jsonLd),
    },
  };
}

export default async function AboutPage({ params }: PageProps) {
  const { lang } = await params;
  
  if (!['zh', 'en'].includes(lang)) {
    notFound();
  }
  
  const dict = await getDictionary(lang);
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
        <Suspense fallback={<div className="sidebar" />}>
          <FilterBarClient 
            locale={lang}
            dict={dict}
            categories={categories}
            initialCategory={null}
            initialPwa={null}
            initialSelfhosted={null}
          />
        </Suspense>
        
        <main className="main-content about-page">
          <div className="about-container">
            <h1 className="about-title">{dict.about.title}</h1>
            
            <section className="about-section">
              <h2 className="about-section-title">{dict.about.origin}</h2>
              <p className="about-section-content">{dict.about.originContent}</p>
            </section>
            
            <section className="about-section">
              <h2 className="about-section-title">{dict.about.criteria}</h2>
              <p className="about-section-content">{dict.about.criteriaContent}</p>
            </section>
          </div>
        </main>
        
        <BottomBar />
      </div>
    </div>
  );
}
