
'use client';
// This file is no longer the primary loading mechanism, 
// but is kept for route-to-route navigation suspense.
// The new GlobalLoader handles the initial page load.
import AnimatedInfinity from '@/components/shared/AnimatedInfinity';
import StaticLogo from '@/components/shared/StaticLogo';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background">
      <div className="mb-8">
        <StaticLogo />
      </div>
      <AnimatedInfinity />
    </div>
  );
}
