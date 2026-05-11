import ClientShell from '@/components/layout/ClientShell'
import PWARegister from '@/components/PWARegister'
import { getCurrentUser } from '@/lib/auth/server'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const appName = 'Mitha Laundry'
const appDescription =
  'Laundry management system untuk operasional harian, pelanggan, order, dan laporan.'
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  applicationName: appName,
  manifest: '/manifest.webmanifest',
  title: {
    default: appName,
    template: `%s | ${appName}`,
  },
  description: appDescription,
  keywords: [
    'Mitha Laundry',
    'laundry management',
    'laundry dashboard',
    'laundry app',
    'manajemen laundry',
    'operasional laundry',
  ],
  authors: [{ name: appName }],
  creator: appName,
  publisher: appName,
  category: 'business',
  alternates: {
    canonical: '/',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: '/',
    siteName: appName,
    title: appName,
    description: appDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: appName,
    description: appDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/icons/pwa-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icons/pwa-512.png', type: 'image/png', sizes: '512x512' },
      { url: '/icons/Background.svg' },
      { url: '/icons/Icon.svg', type: 'image/svg+xml' },
      { url: '/icons/Background.svg', type: 'image/svg+xml', sizes: 'any' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/icons/pwa-192.png', type: 'image/png', sizes: '192x192' }],
  },
  appleWebApp: {
    capable: true,
    title: appName,
    statusBarStyle: 'default',
  },
}

export const viewport: Viewport = {
  themeColor: '#00488d',
  colorScheme: 'light',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userPromise = getCurrentUser()

  return (
    <html lang="id">
      <body className={`${inter.className} bg-gray-50`}>
        <PWARegister />
        <ClientShell user={userPromise}>{children}</ClientShell>
      </body>
    </html>
  )
}
