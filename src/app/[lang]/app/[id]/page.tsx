import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Locale } from '@/lib/types';
import { getAppById, getCategories } from '@/lib/apps';
import { getDictionary } from '@/lib/i18n';
import { Header } from '@/components/Header';
import { ArrowLeft, ExternalLink, Download, Server, Github } from 'lucide-react';

interface PageProps {
  params: Promise<{ lang: Locale; id: string }>;
}

export async function generateStaticParams() {
  return [{ lang: 'zh', id: 'spotify' }, { lang: 'en', id: 'spotify' }];
}

export default async function AppDetailPage({ params }: PageProps) {
  const { lang, id } = await params;
  
  if (!['zh', 'en'].includes(lang)) {
    notFound();
  }
  
  const app = getAppById(id);
  
  if (!app) {
    notFound();
  }
  
  const dict = await getDictionary(lang);
  const categories = getCategories();
  const categoryLabel = categories.find(c => c.value === app.category)?.label[lang] || app.category;
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <Suspense fallback={<div className="h-16 border-b bg-background" />}>
        <Header 
          locale={lang}
          dict={dict}
        />
      </Suspense>
      
      <main className="flex-1 container px-4 py-8">
        <Link 
          href={`/${lang}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {lang === 'en' ? 'Back to list' : '返回列表'}
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
              {app.screenshot && (
                <div className="aspect-video bg-muted">
                  <img 
                    src={app.screenshot} 
                    alt={app.name[lang]}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="h-16 w-16 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                    <img 
                      src={app.icon} 
                      alt={app.name[lang]}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold">{app.name[lang]}</h1>
                    <p className="text-muted-foreground mt-1">{app.description[lang]}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {app.pwaSupported && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                          <Download className="h-4 w-4" />
                          {dict.appCard.pwa}
                        </span>
                      )}
                      {app.selfhosted && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                          <Server className="h-4 w-4" />
                          {dict.appCard.selfhost}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {dict.detail.openApp}
                  </a>
                  
                  {app.selfhosted && app.selfhostUrl && (
                    <a
                      href={app.selfhostUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg border bg-background font-medium hover:bg-muted transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      {lang === 'en' ? 'Self-host' : '自托管'}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="rounded-xl border bg-card shadow-sm p-6">
              <h2 className="font-semibold mb-4">{dict.detail.details}</h2>
              
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm text-muted-foreground">{dict.detail.category}</dt>
                  <dd className="mt-1 font-medium">{categoryLabel}</dd>
                </div>
                
                <div>
                  <dt className="text-sm text-muted-foreground">{dict.detail.developer}</dt>
                  <dd className="mt-1 font-medium">{app.developer}</dd>
                </div>
                
                <div>
                  <dt className="text-sm text-muted-foreground">{dict.detail.lastUpdated}</dt>
                  <dd className="mt-1 font-medium">{app.lastUpdated}</dd>
                </div>
                
                {app.license && (
                  <div>
                    <dt className="text-sm text-muted-foreground">{dict.detail.license}</dt>
                    <dd className="mt-1 font-medium">{app.license}</dd>
                  </div>
                )}
                
                {app.dockerImage && (
                  <div>
                    <dt className="text-sm text-muted-foreground">{dict.detail.dockerImage}</dt>
                    <dd className="mt-1 font-mono text-sm bg-muted px-2 py-1 rounded">
                      {app.dockerImage}
                    </dd>
                  </div>
                )}
                
                {app.tags.length > 0 && (
                  <div>
                    <dt className="text-sm text-muted-foreground mb-2">{dict.detail.tags}</dt>
                    <dd className="flex flex-wrap gap-1.5">
                      {app.tags.map((tag) => (
                        <span 
                          key={tag}
                          className="px-2 py-1 rounded-md bg-muted text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t py-6">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          {dict.footer.description}
        </div>
      </footer>
    </div>
  );
}
