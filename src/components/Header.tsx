'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Locale } from '@/lib/types';

interface HeaderProps {
  locale: Locale;
  dict: {
    header: {
      title: string;
      search: string;
    };
  };
}

export function Header({ locale, dict }: HeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  
  const otherLocale = locale === 'en' ? 'zh' : 'en';

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    router.push(`/${locale}?${params.toString()}`);
  }, [locale, router, searchParams]);

  return (
      <header className="top-header">
      <div className="top-header-content">
        <div className="header-left">
          <Link href={`/${locale}`} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <svg className="header-logo" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="url(#gradient)"/>
              <path d="M16 8C11.5817 8 8 11.5817 8 16C8 20.4183 11.5817 24 16 24C20.4183 24 24 20.4183 24 16C24 11.5817 20.4183 8 16 8Z" fill="white" fillOpacity="0.3"/>
              <path d="M16 12C13.7909 12 12 13.7909 12 16C12 18.2091 13.7909 20 16 20C18.2091 20 20 18.2091 20 16C20 13.7909 18.2091 12 16 12Z" fill="white"/>
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0b9cda"/>
                  <stop offset="1" stopColor="#7b68ee"/>
                </linearGradient>
              </defs>
            </svg>
            <span className="header-title">{dict.header.title}</span>
          </Link>
        </div>
        
        <div className="header-search-container">
          <svg className="header-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={dict.header.search}
            className="header-search-input"
          />
        </div>
        
        <div className="header-right">
          <Link href={`/${otherLocale}`} className="header-lang">
            {otherLocale === 'en' ? 'English' : '中文'}
          </Link>
        </div>
      </div>
    </header>
  );
}
