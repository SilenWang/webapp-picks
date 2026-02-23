'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Locale, Category } from '@/lib/types';
import { 
  Grid, 
  Newspaper, 
  Image, 
  Code2, 
  MonitorPlay, 
  Sparkles, 
  FileText, 
  Wrench 
} from 'lucide-react';

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
  categories: { value: Category; label: { en: string; zh: string }; icon: string }[];
  initialCategory: Category | null;
  initialPwa: boolean | null;
  initialSelfhosted: boolean | null;
}

const iconMap: Record<string, React.ReactNode> = {
  Newspaper: <Newspaper width={20} height={20} />,
  Image: <Image width={20} height={20} />,
  Code2: <Code2 width={20} height={20} />,
  MonitorPlay: <MonitorPlay width={20} height={20} />,
  Sparkles: <Sparkles width={20} height={20} />,
  FileText: <FileText width={20} height={20} />,
  Wrench: <Wrench width={20} height={20} />,
  Grid: <Grid width={20} height={20} />,
};

export function FilterBarClient({
  locale,
  dict,
  categories,
  initialCategory,
}: FilterBarClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    setSidebarOpen(false);
  };

  const allCategories = [
    { value: null, label: { en: 'All Apps', zh: '全部应用' }, iconComponent: iconMap.Grid },
    ...categories.map(cat => ({
      value: cat.value,
      label: cat.label,
      iconComponent: iconMap[cat.icon] || iconMap.Wrench,
    }))
  ];

  return (
    <>
      <button 
        className="mobile-menu-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        {sidebarOpen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <nav>
          {allCategories.map((cat) => (
            <button
              key={cat.value || 'all'}
              onClick={() => handleCategoryChange(cat.value as Category)}
              className={`category-btn ${initialCategory === cat.value ? 'active' : ''}`}
            >
              {cat.iconComponent}
              {cat.label[locale]}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
