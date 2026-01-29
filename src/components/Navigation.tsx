
'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hasVisitedRegistration, setHasVisitedRegistration] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Проверяем, посещал ли пользователь страницу регистрации
    const visited = localStorage.getItem('visited_registration') === 'true'
    setHasVisitedRegistration(visited)
  }, [])

  const handleStartNowClick = () => {
    router.push('/registration_page')
  }

  const menuItems = [
    { href: '/loan', label: 'Кредитная часть' },
    { href: '/invest', label: 'Инвестиционная часть' },
    { href: '/tracker', label: 'Планирование бюджета' }
  ]

  return (
    <motion.nav
      className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container-max">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-finovate-orange to-finovate-orange-hover rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">Q</span>
              </div>
              <span className="text-2xl font-bold text-finovate-navy">Qazinv</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Меню из трех полосок - всегда доступно */}
            <div className="relative">
              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <motion.span
                    className="bg-gray-700 block h-0.5 w-6 rounded-sm mb-1"
                    animate={{ rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 4 : 0 }}
                  />
                  <motion.span
                    className="bg-gray-700 block h-0.5 w-6 rounded-sm mb-1"
                    animate={{ opacity: isMenuOpen ? 0 : 1 }}
                  />
                  <motion.span
                    className="bg-gray-700 block h-0.5 w-6 rounded-sm"
                    animate={{ rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? -4 : 0 }}
                  />
                </div>
              </motion.button>

              {/* Desktop Dropdown Menu */}
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2"
                  >
                    {menuItems.map((item, index) => (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          className="block px-4 py-3 text-gray-700 hover:bg-finovate-orange-light hover:text-finovate-orange transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/*/!* Кнопка "Начать сейчас" - показывается только если пользователь не посещал регистрацию *!/*/}
            {/*{!hasVisitedRegistration && (*/}
            {/*    <motion.button*/}
            {/*      className="btn-primary"*/}
            {/*      whileHover={{ scale: 1.05 }}*/}
            {/*      whileTap={{ scale: 0.95 }}*/}
            {/*      onClick={handleStartNowClick}*/}
            {/*    >*/}
            {/*      Начать сейчас*/}
            {/*    </motion.button>*/}
            {/*)}*/}
          </div>

          {/* Mobile menu button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <motion.span
                className="bg-gray-700 block h-0.5 w-6 rounded-sm"
                animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 4 : -2 }}
              />
              <motion.span
                className="bg-gray-700 block h-0.5 w-6 rounded-sm my-0.5"
                animate={{ opacity: isOpen ? 0 : 1 }}
              />
              <motion.span
                className="bg-gray-700 block h-0.5 w-6 rounded-sm"
                animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -4 : 2 }}
              />
            </div>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="md:hidden py-4 border-t border-gray-200"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col space-y-4">
                {/* Меню всегда доступно на мобильном */}
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="text-gray-700 hover:text-finovate-orange font-medium transition-colors py-2 block"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Кнопка "Начать сейчас" на мобильном - только если не посещал регистрацию */}
                {!hasVisitedRegistration && (
                  <motion.button
                    className="btn-primary w-full"
                    onClick={() => {
                      setIsOpen(false)
                      handleStartNowClick()
                    }}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: menuItems.length * 0.1 }}
                  >
                    Начать сейчас
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}