'use client';
import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

const TransitionProvider = dynamic(() => import('./TransitionProvider'), { ssr: false });
const SmoothScroll = dynamic(() => import('./SmoothScroll'), { ssr: false });
const Cursor = dynamic(() => import('./Cursor'), { ssr: false });
const Navbar = dynamic(() => import('./Navbar'), { ssr: false });

export default function ClientShell({ children }: { children: ReactNode }) {
  return (
    <TransitionProvider>
      <Cursor />
      <Navbar />
      <SmoothScroll>
        {children}
      </SmoothScroll>
    </TransitionProvider>
  );
}
