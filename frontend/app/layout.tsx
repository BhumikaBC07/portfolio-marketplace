import type { Metadata } from 'next'
import '../styles/globals.css'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://portfolio-marketplace.vercel.app'),
  title: 'PortfolioHub — Find Your Perfect Portfolio. Get Hired.',
  description: 'Browse premium portfolio templates for developers, designers, and data scientists. Stand out, get noticed, land your dream job.',
  keywords: 'portfolio templates, developer portfolio, Java engineer portfolio, UI/UX portfolio, data scientist portfolio',
  openGraph: {
    title: 'PortfolioHub — Premium Portfolio Templates',
    description: 'Browse curated portfolio templates for tech professionals.',
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
            href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap"
            rel="stylesheet"
        />
      </head>
      <body>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1a0f08',
              color: '#f9f5ef',
              borderRadius: '2px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
            },
          }}
      />
      </body>
      </html>
  )
}