'use client';

import { useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { WebApp, Locale } from '@/lib/types';
import { ExternalLink, Download, Server, X } from 'lucide-react';

interface AppDialogProps {
  app: WebApp;
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
  };
  categoryLabel: string;
  onClose: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getDoc = () => (globalThis as any).document;

export function AppDialog({ app, locale, dict, categoryLabel, onClose }: AppDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleKeyDown = useCallback((e: any) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  const doc = getDoc();

  useEffect(() => {
    doc.addEventListener('keydown', handleKeyDown);
    doc.body.style.overflow = 'hidden';
    return () => {
      doc.removeEventListener('keydown', handleKeyDown);
      doc.body.style.overflow = '';
    };
  }, [handleKeyDown, doc]);

  const dialog = (
    <div 
      ref={dialogRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div 
        className="w-full max-w-5xl max-h-[85vh] rounded-xl overflow-hidden flex flex-col"
        style={{
          position: 'relative',
          backgroundColor: 'var(--card)',
          border: '1px solid var(--border)',
        }}
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          style={{ 
            position: 'absolute', 
            top: '16px', 
            right: '16px', 
            zIndex: 10,
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
          aria-label={locale === 'en' ? 'Close' : '关闭'}
        >
          <X style={{ width: '16px', height: '16px' }} />
        </button>

        <div className="overflow-y-auto flex-1">
          {app.screenshot && (
            <div className="aspect-video bg-muted">
              <img 
                src={app.screenshot} 
                alt={app.name[locale]}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="h-16 w-16 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                <img 
                  src={app.icon} 
                  alt={app.name[locale]}
                  className="h-full w-full object-cover"
                />
              </div>
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{app.name[locale]}</h1>
                <p className="text-muted-foreground mt-1">{app.description[locale]}</p>
                
                {app.review && app.review[locale] && (
                  <p className="mt-3 p-3 rounded-lg bg-muted/50 text-sm italic">
                    {app.review[locale]}
                  </p>
                )}
                
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
                  <Server className="h-4 w-4" />
                  {locale === 'en' ? 'Self-host' : '自托管'}
                </a>
              )}
            </div>
          </div>
          
          <div className="px-6 pb-6">
            <div 
              className="rounded-xl p-6"
              style={{ border: '1px solid var(--border)' }}
            >
              <h2 className="font-semibold mb-4">{dict.detail.details}</h2>
              
              <dl className="space-y-4">
                <div className="flex flex-wrap gap-x-8 gap-y-2" style={{ minWidth: '200px' }}>
                  <div style={{ minWidth: '100px' }}>
                    <dt className="text-sm text-muted-foreground">{dict.detail.category}</dt>
                    <dd className="font-medium">{categoryLabel}</dd>
                  </div>
                  
                  <div style={{ minWidth: '100px' }}>
                    <dt className="text-sm text-muted-foreground">{dict.detail.developer}</dt>
                    <dd className="font-medium">{app.developer}</dd>
                  </div>
                  
                  <div style={{ minWidth: '100px' }}>
                    <dt className="text-sm text-muted-foreground">{dict.detail.lastUpdated}</dt>
                    <dd className="font-medium">{app.lastUpdated}</dd>
                  </div>
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
      </div>
    </div>
  );

  if (!doc) {
    return null;
  }

  return createPortal(dialog, doc.body);
}
