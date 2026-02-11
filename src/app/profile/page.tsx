'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useProfile } from '@/store/profileStore'

export default function ProfilePage() {
  const { state, dispatch } = useProfile()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: state.user?.name || '',
    email: state.user?.email || '',
    phone: state.user?.phone || ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно для заполнения'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен для заполнения'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный email'
    }

    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Некорректный номер телефона'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validateForm()) {
      dispatch({
        type: 'UPDATE_USER',
        payload: formData
      })
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: state.user?.name || '',
      email: state.user?.email || '',
      phone: state.user?.phone || ''
    })
    setErrors({})
    setIsEditing(false)
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
              Войдите в систему для доступа к профилю
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-finovate-beige-light pt-20">
      <div className="container-max py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-finovate-orange to-finovate-orange-hover rounded-2xl flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {state.user?.name?.charAt(0)?.toUpperCase() || 'П'}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-finovate-navy">Профиль</h1>
                <p className="text-gray-600">Управление личными данными</p>
              </div>
            </div>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-finovate-orange text-white px-6 py-3 rounded-xl font-semibold hover:bg-finovate-orange-hover transition-colors"
              >
                Редактировать
              </button>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                >
                  Сохранить
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                >
                  Отмена
                </button>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-finovate-navy mb-2">
                  Имя *
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-finovate-orange focus:border-finovate-orange transition-all ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Введите ваше имя"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="font-medium text-gray-700">
                      {state.user?.name || 'Не указано'}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-finovate-navy mb-2">
                  Email *
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-finovate-orange focus:border-finovate-orange transition-all ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Введите ваш email"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="font-medium text-gray-700">
                      {state.user?.email || 'Не указано'}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-finovate-navy mb-2">
                  Телефон
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-finovate-orange focus:border-finovate-orange transition-all ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+7 (xxx) xxx-xx-xx"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="font-medium text-gray-700">
                      {state.user?.phone || 'Не указано'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-finovate-navy mb-4">
                  Информация об аккаунте
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Дата регистрации:</span>
                    <span className="font-medium">
                      {state.user?.dateJoined ?
                        new Date(state.user.dateJoined).toLocaleDateString('ru-RU') :
                        'Не указано'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Статус:</span>
                    <span className="font-medium text-green-600">Активный</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Тип аккаунта:</span>
                    <span className="font-medium">Демо</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-finovate-navy mb-4">
                  Быстрые действия
                </h3>
                <div className="space-y-3">
                  <a
                    href="/profile/portfolio"
                    className="flex items-center justify-between p-3 bg-white rounded-xl hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <span className="font-medium">Мой портфель</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-finovate-orange transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>

                  <a
                    href="/profile/settings"
                    className="flex items-center justify-between p-3 bg-white rounded-xl hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <span className="font-medium">Настройки</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-finovate-orange transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}