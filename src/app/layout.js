import { Inter } from 'next/font/google';
import Sidebar from '@/components/Sidebar';
import ThemeProvider from '@/components/ThemeProvider';
import Providers from '@/components/Providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const siteUrl = process.env.NEXTAUTH_URL || 'https://task-peach-three.vercel.app';

export const metadata = {
  title: 'Arion | More Than a To-Do List',
  description: 'Boost your productivity with Arion. AI-powered task management with Smart Priority, Eisenhower Matrix, Focus Timer, and real-time analytics. Plan. Focus. Achieve.',
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'Arion | More Than a To-Do List',
    description: 'Boost your productivity with Arion. AI-powered task management with Smart Priority, Eisenhower Matrix, Focus Timer, and real-time analytics.',
    url: siteUrl,
    siteName: 'Arion Task Management',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Arion — AI-Powered Smart Task Management',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arion | More Than a To-Do List',
    description: 'AI-powered task management with Smart Priority, Focus Timer, and real-time analytics. Plan. Focus. Achieve.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable}`}>
        <Providers>
          <ThemeProvider>
            <div className="page-container">
              <Sidebar />
              <main className="main-content">
                {children}
              </main>
            </div>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
