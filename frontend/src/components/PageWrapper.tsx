'use client';

import { usePathname } from 'next/navigation';

interface PageWrapperProps {
  children: React.ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  
  return (
    <div style={{ paddingTop: isHomePage ? '0' : '72px' }}>
      {children}
    </div>
  );
}