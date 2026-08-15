import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: 'Solstice — 24 hour planner',
  description: 'A clear view of your day, tuned to the light outside.',
  applicationName: 'Solstice',
  generator: 'Next.js',
  keywords: ['Solstice', '24 hour planner', 'daily planning', 'sunrise', 'sunset'],
  openGraph: {
    title: 'Solstice — 24 hour planner',
    description: 'Plan your day around the light outside.',
    type: 'website',
    siteName: 'Solstice',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Solstice 24 hour planner dial' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solstice — 24 hour planner',
    description: 'Plan your day around the light outside.',
    images: ['/opengraph-image'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
