
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function TrackerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/tracker') {
      return pathname === '/tracker'
    }
    return pathname.startsWith(path)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-finovate-beige to-finovate-beige-light">
      <div className="container-max py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-finovate-navy mb-6">
            Планирование бюджета
          </h1>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Эффективное управление личными финансами, отслеживание доходов и расходов,
            планирование финансовых целей и анализ трат с помощью визуальных инструментов.
          </p>
        </motion.div>

        {/* Navigation - центрирована */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-white rounded-2xl p-2 flex space-x-1 shadow-lg">
            <Link
              href="/tracker"
              className={`px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all text-sm sm:text-base whitespace-nowrap ${
                isActive('/tracker')
                  ? 'bg-finovate-orange text-white shadow-lg'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Бюджет
            </Link>
            <Link
              href="/tracker/analytics"
              className={`px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all text-sm sm:text-base whitespace-nowrap ${
                isActive('/tracker/analytics')
                  ? 'bg-finovate-orange text-white shadow-lg'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Аналитика
            </Link>
            <Link
              href="/tracker/goals"
              className={`px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all text-sm sm:text-base whitespace-nowrap ${
                isActive('/tracker/goals')
                  ? 'bg-finovate-orange text-white shadow-lg'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Цели
            </Link>
          </div>
        </motion.div>

        {/* Content */}
        {children}
      </div>
    </main>
  )
}