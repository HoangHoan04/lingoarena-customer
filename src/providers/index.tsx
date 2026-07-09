'use client';

import React from 'react';
import QueryProvider from './QueryProvider';
import ThemeProvider from './ThemeProvider';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
