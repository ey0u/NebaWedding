import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { LanguageProvider } from "@/contexts/LanguageContext";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Nebiyu & Hewan — Forever Starts Here',
  description: 'Join Nebiyu and Hewan as they begin their forever.',
  // generator: 'v0.app',
  // icons: {
  //   icon: [
  //     {
  //       url: '/icon-light-32x32.png',
  //       media: '(prefers-color-scheme: light)',
  //     },
  //     {
  //       url: '/icon-dark-32x32.png',
  //       media: '(prefers-color-scheme: dark)',
  //     },
  //     {
  //       url: '/icon.svg',
  //       type: 'image/svg+xml',
  //     },
  //   ],
  //   apple: '/apple-icon.png',
  // },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#fbf7ef',
}

import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="antialiased">
        <LanguageProvider>
          <LanguageSwitcher />
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </LanguageProvider>
      </body>
    </html>
  )
}
