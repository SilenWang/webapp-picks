'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect, useRef } from 'react';
import { Locale } from '@/lib/types';
import { Globe, Sun, Moon, Monitor, ChevronDown, Check, BookOpen } from 'lucide-react';

type Theme = 'light' | 'dark' | 'auto';

interface DropdownPosition {
  top: number;
  left: number;
}

interface HeaderProps {
  locale: Locale;
  dict: {
    header: {
      title: string;
      search: string;
      language: string;
      theme: string;
      themeLight: string;
      themeDark: string;
      themeAuto: string;
      about: string;
    };
  };
}

export function Header({ locale, dict }: HeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [theme, setTheme] = useState<Theme>('auto');
  const [mounted, setMounted] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [langDropdownPos, setLangDropdownPos] = useState<DropdownPosition>({ top: 0, left: 0 });
  const [themeDropdownPos, setThemeDropdownPos] = useState<DropdownPosition>({ top: 0, left: 0 });
  
  const themeTriggerRef = useRef<HTMLButtonElement>(null);
  const langTriggerRef = useRef<HTMLButtonElement>(null);

  const applyTheme = useCallback((themeValue: Theme) => {
    const apply = (isDark: boolean) => {
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    };

    if (themeValue === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      apply(mediaQuery.matches);
      
      const handler = (e: MediaQueryListEvent) => apply(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      apply(themeValue === 'dark');
    }
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const initialTheme = savedTheme || 'auto';
    setTheme(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);
  }, [applyTheme]);

  useEffect(() => {
    if (!mounted) return;
    const cleanup = applyTheme(theme);
    return cleanup;
  }, [theme, mounted, applyTheme]);

  const handleThemeChange = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    setThemeDropdownOpen(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeTriggerRef.current && !themeTriggerRef.current.contains(event.target as Node)) {
        setThemeDropdownOpen(false);
      }
      if (langTriggerRef.current && !langTriggerRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateDropdownPosition = useCallback((
    isOpen: boolean,
    triggerRef: React.RefObject<HTMLButtonElement | null>,
    setPos: (pos: DropdownPosition) => void,
    menuWidth: number = 140
  ) => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      let left = rect.left;
      if (left + menuWidth > viewportWidth) {
        left = viewportWidth - menuWidth - 8;
      }
      setPos({
        top: rect.bottom + 8,
        left: left,
      });
    }
  }, []);

  const handleLangDropdownToggle = useCallback(() => {
    const newState = !langDropdownOpen;
    setLangDropdownOpen(newState);
    updateDropdownPosition(newState, langTriggerRef, setLangDropdownPos, 140);
  }, [langDropdownOpen, updateDropdownPosition]);

  const handleThemeDropdownToggle = useCallback(() => {
    const newState = !themeDropdownOpen;
    setThemeDropdownOpen(newState);
    updateDropdownPosition(newState, themeTriggerRef, setThemeDropdownPos, 160);
  }, [themeDropdownOpen, updateDropdownPosition]);

  useEffect(() => {
    if (langDropdownOpen) {
      updateDropdownPosition(true, langTriggerRef, setLangDropdownPos, 140);
    }
  }, [langDropdownOpen, updateDropdownPosition]);

  useEffect(() => {
    if (themeDropdownOpen) {
      updateDropdownPosition(true, themeTriggerRef, setThemeDropdownPos, 160);
    }
  }, [themeDropdownOpen, updateDropdownPosition]);

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

  const getThemeIcon = () => {
    if (!mounted) return <Monitor size={18} />;
    if (theme === 'light') return <Sun size={18} />;
    if (theme === 'dark') return <Moon size={18} />;
    return <Monitor size={18} />;
  };

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
          <Link
            href={`/${locale}/about`}
            className="dropdown-trigger"
            aria-label={dict.header.about}
          >
            <BookOpen size={18} />
          </Link>

          <div className="dropdown-wrapper">
            <button 
              ref={langTriggerRef}
              className="dropdown-trigger"
              onClick={handleLangDropdownToggle}
              aria-label={dict.header.language}
            >
              <Globe size={18} />
              <ChevronDown size={14} className={`dropdown-chevron ${langDropdownOpen ? 'open' : ''}`} />
            </button>
            {langDropdownOpen && (
              <div 
                className="dropdown-menu"
                style={{ top: langDropdownPos.top, left: langDropdownPos.left }}
              >
                <button 
                  className="dropdown-item"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setLangDropdownOpen(false);
                    router.push('/en');
                  }}
                >
                  English
                  {locale === 'en' && <Check size={14} className="dropdown-check" />}
                </button>
                <button 
                  className="dropdown-item"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setLangDropdownOpen(false);
                    router.push('/zh');
                  }}
                >
                  中文
                  {locale === 'zh' && <Check size={14} className="dropdown-check" />}
                </button>
              </div>
            )}
          </div>

          <div className="dropdown-wrapper">
            <button 
              ref={themeTriggerRef}
              className="dropdown-trigger"
              onClick={handleThemeDropdownToggle}
              aria-label={dict.header.theme}
            >
              {getThemeIcon()}
              <ChevronDown size={14} className={`dropdown-chevron ${themeDropdownOpen ? 'open' : ''}`} />
            </button>
            {themeDropdownOpen && (
              <div 
                className="dropdown-menu"
                style={{ top: themeDropdownPos.top, left: themeDropdownPos.left }}
              >
                <button 
                  className="dropdown-item"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleThemeChange('light');
                  }}
                >
                  <Sun size={16} />
                  {dict.header.themeLight}
                  {theme === 'light' && <Check size={14} className="dropdown-check" />}
                </button>
                <button 
                  className="dropdown-item"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleThemeChange('dark');
                  }}
                >
                  <Moon size={16} />
                  {dict.header.themeDark}
                  {theme === 'dark' && <Check size={14} className="dropdown-check" />}
                </button>
                <button 
                  className="dropdown-item"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleThemeChange('auto');
                  }}
                >
                  <Monitor size={16} />
                  {dict.header.themeAuto}
                  {theme === 'auto' && <Check size={14} className="dropdown-check" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
