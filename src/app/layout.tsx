import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Vision Hub - Multi-Modal AI Analysis Platform',
  description: 'Professional AI-powered image and text analysis with real-time chat capabilities powered by Google Gemini',
  keywords: ['AI', 'Machine Learning', 'Image Analysis', 'Text Analysis', 'Google Gemini', 'Computer Vision'],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    title: 'AI Vision Hub',
    description: 'Multi-Modal AI Analysis Platform',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
