
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useProfile } from '@/store/profileStore'

export default function SettingsPage() {
  const { state, dispatch } = useProfile()
  const [settings, setSettings] = useState(state.settings)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (!state.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-finovate-beige to-finovate-beige-light pt-20">
        <div className="container-max py-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-finovate-navy mb-4">
              Необходима авторизация
            </h1>
            <p className="text-gray-600 mb-8">
              Войдите в систему для доступа к настройкам
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-finovate-beige to-finovate-beige-light pt-20">
      <div className="container-max py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-finovate-navy">Настройки</h1>
              <p className="text-gray-600">Персонализация интерфейса и отображения</p>
            </div>

            {saved && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-100 text-green-800 px-4 py-2 rounded-xl font-semibold"
              >
                ✓ Настройки сохранены
              </motion.div>
            )}
          </div>

          <div className="space-y-8">
            {/* Currency Settings */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-finovate-navy mb-4">
                Настройки валюты
              </h2>
              <p className="text-gray-600 mb-6">
                Выберите основную валюту для отображения в портфеле
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-finovate-navy mb-3">
                    Основная валюта
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="currency"
                        value="USD"
                        checked={settings.currency === 'USD'}
                        onChange={(e) => setSettings({ ...settings, currency: e.target.value as 'USD' | 'KZT' })}
                        className="text-finovate-orange focus:ring-finovate-orange"
                      />
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">USD</span>
                        <span className="text-gray-600">- Доллар США</span>
                      </div>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="currency"
                        value="KZT"
                        checked={settings.currency === 'KZT'}
                        onChange={(e) => setSettings({ ...settings, currency: e.target.value as 'USD' | 'KZT' })}
                        className="text-finovate-orange focus:ring-finovate-orange"
                      />
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">KZT</span>
                        <span className="text-gray-600">- Казахстанский тенге</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-blue-700">
                      <p className="font-semibold mb-1">Информация о валютах:</p>
                      <p>• USD отображается как основная валюта, KZT как дополнительная</p>
                      <p>• KZT отображается как основная валюта, USD как дополнительная</p>
                      <p>• Курс обмена обновляется автоматически (в реальной версии)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Language Settings */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-finovate-navy mb-4">
                Язык интерфейса
              </h2>
              <p className="text-gray-600 mb-6">
                Выберите предпочитаемый язык для отображения интерфейса
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-finovate-navy mb-3">
                    Язык
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="language"
                        value="ru"
                        checked={settings.language === 'ru'}
                        onChange={(e) => setSettings({ ...settings, language: e.target.value as 'ru' | 'en' })}
                        className="text-finovate-orange focus:ring-finovate-orange"
                      />
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">Русский</span>
                        <span className="text-gray-600">🇷🇺</span>
                      </div>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="language"
                        value="en"
                        checked={settings.language === 'en'}
                        onChange={(e) => setSettings({ ...settings, language: e.target.value as 'ru' | 'en' })}
                        className="text-finovate-orange focus:ring-finovate-orange"
                      />
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">English</span>
                        <span className="text-gray-600">🇺🇸</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.084 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div className="text-sm text-yellow-700">
                      <p className="font-semibold mb-1">В разработке:</p>
                      <p>Полная поддержка английского языка будет добавлена в следующих версиях</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Future Settings Placeholder */}
            <div className="bg-gray-50 rounded-2xl p-6 opacity-50">
              <h2 className="text-xl font-bold text-finovate-navy mb-4">
                Дополнительные настройки
              </h2>
              <p className="text-gray-600 mb-6">
                Скоро будут доступны дополнительные возможности настройки
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-700">Уведомления по email</div>
                    <div className="text-sm text-gray-500">Получать важные обновления портфеля</div>
                  </div>
                  <div className="w-12 h-6 bg-gray-300 rounded-full relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-700">Темная тема</div>
                    <div className="text-sm text-gray-500">Переключить на темный режим интерфейса</div>
                  </div>
                  <div className="w-12 h-6 bg-gray-300 rounded-full relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-700">Автоматическое обновление цен</div>
                    <div className="text-sm text-gray-500">Обновлять котировки в реальном времени</div>
                  </div>
                  <div className="w-12 h-6 bg-gray-300 rounded-full relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              className="bg-finovate-orange text-white px-8 py-3 rounded-xl font-semibold hover:bg-finovate-orange-hover transition-colors"
            >
              Сохранить настройки
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}