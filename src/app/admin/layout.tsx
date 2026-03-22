import type { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.12),_transparent_35%),linear-gradient(180deg,_rgba(13,15,18,1)_0%,_rgba(20,24,31,1)_100%)]">
      {children}
    </div>
  );
}
