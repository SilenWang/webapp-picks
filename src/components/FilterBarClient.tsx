'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
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

const categoryIcons: Record<string, React.ReactNode> = {
  productivity: (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
      <rect x="3.75" y="3.75" width="5.5" height="5.5" rx="1.25" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="3.75" y="12.75" width="5.5" height="5.5" rx="1.25" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="12.75" y="3.75" width="5.5" height="5.5" rx="1.25" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="12.75" y="12.75" width="5.5" height="5.5" rx="2.75" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  developer: (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
      <path d="M10 5.5H5.5C4.96957 5.5 4.46086 5.71071 4.08579 6.08579C3.71071 6.46086 3.5 6.96957 3.5 7.5V16.5C3.5 17.0304 3.71071 17.5391 4.08579 17.9142C4.46086 18.2893 4.96957 18.5 5.5 18.5H15.5C16.0304 18.5 16.5391 18.2893 16.9142 17.9142C17.2893 17.5391 17.5 17.0304 17.5 16.5V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15.3789 7.64756L16.0197 8.31661M16.7236 6.28737C16.9029 6.4718 17.0021 6.71892 17 6.97548C16.9978 7.23204 16.8945 7.47749 16.7122 7.65893L12.0171 12.3309L10 13L10.6724 10.9928L15.3702 6.27867C15.5353 6.11307 15.7563 6.01429 15.9904 6.00143C16.2245 5.98858 16.4551 6.06257 16.6376 6.20909L16.7236 6.28737Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  media: (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
      <path d="M11 18.1667C14.958 18.1667 18.1667 14.9581 18.1667 11C18.1667 7.042 14.958 3.83337 11 3.83337C7.04197 3.83337 3.83334 7.042 3.83334 11C3.83334 14.9581 7.04197 18.1667 11 18.1667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11.06 13.69C12.542 13.69 13.7433 12.4887 13.7433 11.0067C13.7433 9.52473 12.542 8.32336 11.06 8.32336C9.57805 8.32336 8.37668 9.52473 8.37668 11.0067C8.37668 12.4887 9.57805 13.69 11.06 13.69Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  social: (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
      <path d="M16.7889 10.1642H16.4455V7.01319C16.4455 6.78008 16.3562 6.55652 16.1972 6.39168C16.0382 6.22685 15.8225 6.13425 15.5977 6.13425H13.0542C13.0274 5.60521 12.8221 5.10276 12.4742 4.71475C12.1263 4.32674 11.6579 4.07785 11.1509 4.01159" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  tools: (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
      <path d="M8.66667 5C8.66667 5.61884 8.9125 6.21233 9.35008 6.64992C9.78767 7.0875 10.3812 7.33333 11 7.33333C11.6188 7.33333 12.2123 7.0875 12.6499 6.64992C13.0875 6.21233 13.3333 5.61884 13.3333 5H15.4547L18 8.81811L15.7728 10.7276V18H6.22717V10.7272L4 8.81811L6.54567 5H8.66667Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  ),
  education: (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
      <path d="M17.9996 14.6023H3.802C4.15979 10.997 7.2015 8.1814 10.9006 8.1814C14.6005 8.1814 17.6422 10.997 18 14.6023H17.9996Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  ),
  entertainment: (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
      <rect x="3" y="4" width="4" height="14" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="9" y="4" width="4" height="14" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="15" y="4" width="4" height="14" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  shopping: (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
      <path d="M4 6H5.54567L6.27267 9.63636H16.1818L16.909 6H18" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <circle cx="7.5" cy="18" r="1.5" fill="currentColor"/>
      <circle cx="15.5" cy="18" r="1.5" fill="currentColor"/>
    </svg>
  ),
  all: (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="12" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="3" y="12" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="12" y="12" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
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
    { value: null, label: { en: 'All Apps', zh: '全部应用' }, icon: categoryIcons.all },
    ...categories.map(cat => ({
      value: cat.value,
      label: cat.label,
      icon: categoryIcons[cat.value] || categoryIcons.tools,
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
              {cat.icon}
              {cat.label[locale]}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
