import ClientShell from '@/components/layout/ClientShell'
import { getCurrentUser } from '@/lib/auth/server'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mitha Laundry - Premium Service',
  description: 'Laundry management system',
  icons: {
    icon: '/icons/Background.svg',

  },
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
        <ClientShell user={userPromise}>{children}</ClientShell>
      </body>
    </html>
  )
}
