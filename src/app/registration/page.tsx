
'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function RegistrationPage() {
  const router = useRouter()

  useEffect(() => {
    // Устанавливаем флаг, что пользователь посетил страницу регистрации
    if (typeof window !== 'undefined') {
      localStorage.setItem('visited_registration', 'true')
    }
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-finovate-beige to-finovate-beige-light flex items-center justify-center">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-24 h-24 bg-finovate-orange rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>

            <h1 className="text-4xl font-bold text-finovate-navy mb-6">
              Страница регистрации
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              Эта страница находится в разработке. Скоро здесь появится полноценная система регистрации.
            </p>

            <motion.button
              onClick={() => router.back()}
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Вернуться назад
            </motion.button>
          </div>
        </motion.div>
      </div>
    </main>
  )
}