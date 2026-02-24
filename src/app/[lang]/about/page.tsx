import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Locale, Category } from '@/lib/types';
import { getCategories } from '@/lib/apps';
import { getDictionary } from '@/lib/i18n';
import { Header } from '@/components/Header';
import { FilterBarClient } from '@/components/FilterBarClient';
import { BottomBar } from '@/components/BottomBar';

interface PageProps {
  params: Promise<{ lang: Locale }>;
}

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
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
