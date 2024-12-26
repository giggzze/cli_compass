interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
  backLink?: string;
}

import Link from 'next/link';

export default function PageLayout({ title, children, backLink }: PageLayoutProps) {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{title}</h1>
          {backLink && (
            <Link
              href={backLink}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Back
            </Link>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
