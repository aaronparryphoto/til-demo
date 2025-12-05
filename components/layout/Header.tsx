// App header component

import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b border-border-default bg-white">
      <div className="max-w-container mx-auto px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
              TIL Trivia
            </h1>
          </Link>

          <div className="flex items-center gap-4">
            {/* Future: Add stats button, settings, etc. */}
          </div>
        </div>
      </div>
    </header>
  );
}
