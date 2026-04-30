import { Suspense } from 'react';
import PortfoliosBrowser from './PortfoliosBrowser';

function LoadingFallback() {
  return (
      <div
          className="pt-16 min-h-screen flex items-center justify-center"
          style={{ backgroundColor: '#f9f5ef' }}
      >
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4"
               style={{ borderColor: '#2c1810', borderTopColor: 'transparent' }}
          />
          <p className="text-sm text-ink-muted">Loading portfolios...</p>
        </div>
      </div>
  );
}

export default function PortfoliosPage() {
  return (
      <Suspense fallback={<LoadingFallback />}>
        <PortfoliosBrowser />
      </Suspense>
  );
}