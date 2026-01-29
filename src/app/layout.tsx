import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins' 
})

export const metadata: Metadata = {
  title: 'Qazinv - Умный путь к финансовой осознанности',
  description: 'Qazinv помогает людям понимать кредиты и инвестиции, чтобы принимать более взвешенные финансовые решения',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={`${inter.variable} ${poppins.variable}`}>
      <body className={`${inter.className} font-sans`}>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  )
}