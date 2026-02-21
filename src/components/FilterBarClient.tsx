'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Locale, Category } from '@/lib/types';

interface FilterBarClientProps {
  locale: Locale;
  dict: {
    filters: {
      all: string;
      category: string;
      pwaSupported: string;
      selfhosted: string;
      yes: string;
      no: string;
    };
  };
  categories: { value: Category; label: { en: string; zh: string } }[];
  initialCategory: Category | null;
  initialPwa: boolean | null;
  initialSelfhosted: boolean | null;
}

export function FilterBarClient({
  locale,
  dict,
  categories,
  initialCategory,
  initialPwa,
  initialSelfhosted,
}: FilterBarClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );
  
  const handleCategoryChange = (category: Category | null) => {
    router.push(`/${locale}?${createQueryString('category', category || '')}`);
  };
  
  const handlePwaChange = (pwa: boolean | null) => {
    router.push(`/${locale}?${createQueryString('pwa', pwa === null ? '' : pwa.toString())}`);
  };
  
  const handleSelfhostedChange = (selfhosted: boolean | null) => {
    router.push(`/${locale}?${createQueryString('selfhosted', selfhosted === null ? '' : selfhosted.toString())}`);
  };
  
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{dict.filters.category}:</span>
        <select
          value={initialCategory || ''}
          onChange={(e) => handleCategoryChange(e.target.value as Category || null)}
          className="h-9 px-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">{dict.filters.all}</option>
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label[locale]}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{dict.filters.pwaSupported}:</span>
        <select
          value={initialPwa === null ? '' : initialPwa.toString()}
          onChange={(e) => {
            const val = e.target.value;
            handlePwaChange(val === '' ? null : val === 'true');
          }}
          className="h-9 px-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">{dict.filters.all}</option>
          <option value="true">{dict.filters.yes}</option>
          <option value="false">{dict.filters.no}</option>
        </select>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{dict.filters.selfhosted}:</span>
        <select
          value={initialSelfhosted === null ? '' : initialSelfhosted.toString()}
          onChange={(e) => {
            const val = e.target.value;
            handleSelfhostedChange(val === '' ? null : val === 'true');
          }}
          className="h-9 px-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">{dict.filters.all}</option>
          <option value="true">{dict.filters.yes}</option>
          <option value="false">{dict.filters.no}</option>
        </select>
      </div>
    </div>
  );
}
