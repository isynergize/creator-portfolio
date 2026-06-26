import type { Metadata } from 'next';
import { Carrois_Gothic_SC, Comme, Playwrite_US_Trad } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import './globals.css';

const carrois = Carrois_Gothic_SC({
  variable: '--font-carrois',
  subsets: ['latin'],
  weight: '400',
});

const comme = Comme({
  variable: '--font-comme',
  subsets: ['latin'],
});

const playwrite = Playwrite_US_Trad({
  variable: '--font-playwrite',
  weight: '400',
});

// Site-wide metadata configuration
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourname.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Your Name - Portfolio',
    template: '%s | Your Name',
  },
  description: 'Developer, designer, and creator. Building things for the web. Explore projects, read book reviews, and see what I\'m currently working on.',
  keywords: ['portfolio', 'developer', 'blog', 'Next.js', 'React', 'TypeScript', 'web development'],
  authors: [{ name: 'Your Name', url: siteUrl }],
  creator: 'Your Name',
  publisher: 'Your Name',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Your Name - Portfolio',
    title: 'Your Name - Portfolio',
    description: 'Developer, designer, and creator. Building things for the web.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Your Name - Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Name - Portfolio',
    description: 'Developer, designer, and creator. Building things for the web.',
    creator: '@yourhandle',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
    types: {
      'application/rss+xml': '/rss.xml',
    },
  },
  verification: {
    // google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${carrois.variable} ${comme.variable} ${playwrite.variable} antialiased min-h-screen`}
      >
        <ThemeProvider>
          <Header />
          <main className="max-w-3xl mx-auto px-4 py-12">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
