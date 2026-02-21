import { Locale } from '@/lib/types';

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export default function LangLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
