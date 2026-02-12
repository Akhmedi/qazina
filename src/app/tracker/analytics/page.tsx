'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

// Компонент круговой диаграммы
const PieChart = ({ data, total }: { data: Array<{name: string, value: number, color: string}>, total: number }) => {
  let currentAngle = 0

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <svg width="200" height="200" className="transform -rotate-90">
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="20"
          />
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100
            const strokeDasharray = `${(percentage / 100) * 502} 502`
            const strokeDashoffset = -currentAngle * 502 / 100
            currentAngle += percentage

            return (
              <circle
                key={index}
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke={item.color}
                strokeWidth="20"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300"
              />
            )
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-finovate-navy">
              {total.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">тг</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month')
  const [timeframe, setTimeframe] = useState<'months' | 'years'>('months')

  // Моковые данные (заменятся на реальные)
  const mockExpenses = [
    { name: 'Питание', value: 120000, color: '#10B981' },
    { name: 'Коммунальные услуги', value: 45000, color: '#F28B30' },
    { name: 'Транспорт', value: 30000, color: '#F59E0B' },
    { name: 'Развлечения', value: 25000, color: '#EF4444' },
  ]

  const totalExpense = mockExpenses.reduce((sum, item) => sum + item.value, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Селектор периода */}
      <div className="flex justify-center">
        <div className="bg-white rounded-2xl p-2 flex space-x-2 shadow-lg">
          {(['week', 'month', 'year'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                period === p
                  ? 'bg-finovate-orange text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {p === 'week' ? 'Неделя' : p === 'month' ? 'Месяц' : 'Год'}
            </button>
          ))}
        </div>
      </div>

      {/* Основной блок аналитики */}
      <div className="bg-white rounded-3xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-finovate-navy mb-8 text-center">Анализ расходов</h2>

        <div className="grid lg:grid-cols-10 gap-8">
          {/* Левая часть - 30% - Круговая диаграмма */}
          <div className="lg:col-span-3">
            <h3 className="text-xl font-bold text-finovate-navy mb-6 text-center">
              Распределение расходов
            </h3>

            <PieChart data={mockExpenses} total={totalExpense} />

            {/* Список категорий */}
            <div className="mt-6 space-y-3">
              {mockExpenses.map((item, index) => {
                const percentage = ((item.value / totalExpense) * 100).toFixed(1)
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">
                        {item.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-finovate-navy">
                        {item.value.toLocaleString()} тг
                      </div>
                      <div className="text-xs text-gray-500">
                        {percentage}%
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Правая часть - 70% - График */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-finovate-navy">Динамика трат</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setTimeframe('months')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    timeframe === 'months'
                      ? 'bg-finovate-orange text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  По месяцам
                </button>
                <button
                  onClick={() => setTimeframe('years')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    timeframe === 'years'
                      ? 'bg-finovate-orange text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  По годам
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 h-64 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 17V3h14v14H3zm2-2h10V5H5v10z"/>
                </svg>
                <p>График будет добавлен позже</p>
                <p className="text-sm">Основан на ваших данных о расходах</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Статистика */}
      <div className="bg-white rounded-3xl shadow-2xl p-8">
        <h3 className="text-2xl font-bold text-finovate-navy mb-6">Статистика за {period === 'week' ? 'неделю' : period === 'month' ? 'месяц' : 'год'}</h3>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-2xl">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {Math.round(totalExpense / mockExpenses.length).toLocaleString()} тг
            </div>
            <div className="text-gray-600">Средний расход</div>
          </div>
          <div className="text-center p-6 bg-purple-50 rounded-2xl">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {mockExpenses.length}
            </div>
            <div className="text-gray-600">Категорий трат</div>
          </div>
          <div className="text-center p-6 bg-indigo-50 rounded-2xl">
            <div className="text-2xl font-bold text-indigo-600 mb-2">
              15.2%
            </div>
            <div className="text-gray-600">Сбережения</div>
          </div>
          <div className="text-center p-6 bg-cyan-50 rounded-2xl">
            <div className="text-2xl font-bold text-cyan-600 mb-2">
              {Math.max(...mockExpenses.map(item => item.value)).toLocaleString()} тг
            </div>
            <div className="text-gray-600">Крупнейший расход</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}