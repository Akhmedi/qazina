'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
  </svg>
)

const ChartIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path d="M3 17V3h14v14H3zm2-2h10V5H5v10z"/>
  </svg>
)

export default function ETFPage() {
  const [timeFrame, setTimeFrame] = useState('day')

  const topETFs = [
    { name: "KASE ETF", symbol: "KASE", yield: "+12.3%", price: "8,750" },
    { name: "Kazakhstan Index Fund", symbol: "KIF", yield: "+9.8%", price: "15,240" },
    { name: "Central Asia ETF", symbol: "CAETF", yield: "+7.5%", price: "12,800" },
    { name: "Emerging Markets KZ", symbol: "EMKZ", yield: "+11.2%", price: "6,950" }
  ]

  const newsItems = [
    {
      title: "Новый ETF фонд от KASE привлек 2 млрд тенге за первую неделю",
      source: "kase.kz",
      time: "2 часа назад"
    },
    {
      title: "Диверсификация портфеля: почему ETF становятся популярнее в Казахстане",
      source: "invest.kz",
      time: "6 часов назад"
    }
  ]

  return (
    <main className="min-h-screen bg-white">
      <div className="container-max py-20">
        {/* Back to Investment Button */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/invest"
            className="flex items-center text-finovate-orange hover:text-finovate-orange-hover font-semibold text-lg transition-colors"
          >
            ← Инвестиционная часть
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-finovate-navy mb-6">
            ETF
          </h1>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Диверсифицированные фонды для снижения рисков и стабильного роста
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Search Bar */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Поиск ETF..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-finovate-orange focus:border-finovate-orange"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <SearchIcon />
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-finovate-navy">KASE ETF</h3>
                <p className="text-finovate-orange font-semibold">₸8,750 (+1.2%)</p>
              </div>
              <div className="flex space-x-2">
                {['День', 'Неделя', 'Месяц', 'Год'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeFrame(period.toLowerCase())}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      timeFrame === period.toLowerCase()
                        ? 'bg-finovate-orange text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* Placeholder Chart */}
            <div className="bg-gray-50 rounded-xl h-64 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <ChartIcon />
                <p className="mt-2">График ETF</p>
                <p className="text-sm">Данные за выбранный период: {timeFrame}</p>
              </div>
            </div>
          </div>

          {/* News and Leaders Section */}
          <div className="grid lg:grid-cols-5 gap-6">
            {/* News Section - 60% */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-finovate-navy">Новости</h3>
                <button className="text-finovate-orange font-semibold hover:text-finovate-orange-hover">
                  Увидеть больше
                </button>
              </div>

              <div className="space-y-4">
                {newsItems.map((news, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <h4 className="font-semibold text-finovate-navy hover:text-finovate-orange cursor-pointer transition-colors">
                      {news.title}
                    </h4>
                    <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                      <span>{news.source}</span>
                      <span>{news.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular ETFs Section - 40% */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-finovate-navy">
                  Популярные ETF
                </h3>
                <button className="text-finovate-orange font-semibold hover:text-finovate-orange-hover">
                  Увидеть больше
                </button>
              </div>

              <div className="space-y-3">
                {topETFs.map((etf, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-finovate-navy">{etf.name}</div>
                      <div className="text-sm text-gray-500">{etf.symbol}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-finovate-navy">₸{etf.price}</div>
                      <div className="text-sm text-green-600">{etf.yield}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}