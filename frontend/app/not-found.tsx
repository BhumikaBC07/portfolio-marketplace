import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="pt-16 min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: '#f9f5ef' }}
    >
      <div className="text-center max-w-md">
        <div
          className="font-serif mb-6 select-none"
          style={{ fontSize: '8rem', lineHeight: '1', color: '#e6ddd0' }}
        >
          404
        </div>
        <h1 className="font-serif text-display-sm text-ink mb-4">Page Not Found</h1>
        <p className="text-ink-muted mb-8 leading-relaxed">
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className="btn-espresso">
            Back to Home
          </Link>
          <Link href="/portfolios" className="btn-outline">
            Browse Portfolios
          </Link>
        </div>
      </div>
    </div>
  );
}
