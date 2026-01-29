
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip = ({ content, children }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 p-3 bg-finovate-navy text-white text-sm rounded-lg shadow-lg -top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
          >
            {content}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-finovate-navy rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
  </svg>
)

export default function InnerStocksPage() {
  const [timeFrame, setTimeFrame] = useState('day')
  const [currentMetricIndex, setCurrentMetricIndex] = useState(0)
  const [showAdditionalMetrics, setShowAdditionalMetrics] = useState(false)

  // Данные компании (заглушки для будущего backend)
  const companyData = {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 192.45,
    change: 1.23,
    sector: "Техно сфера",
    description: "Apple Inc. — американская транснациональная технологическая корпорация, которая проектирует, разрабатывает и продаёт потребительскую электронику, компьютерное программное обеспечение и онлайн-сервисы."
  }

  const metrics = [
    {
      name: "Выручка (Revenue)",
      description: "Показывает, растёт ли основной бизнес компании или со временем теряет спрос.",
      fiveYear: "250.2B ₸",
      tenYear: "180.4B ₸"
    },
    {
      name: "Чистая прибыль (Net Income)",
      description: "Показывает, зарабатывает ли компания больше или меньше после всех расходов.",
      fiveYear: "85.5B ₸",
      tenYear: "45.2B ₸"
    },
    {
      name: "Прибыль на акцию (EPS)",
      description: "Показывает, какая часть прибыли приходится на одну акцию и фактически принадлежит акционеру.",
      fiveYear: "6.15 ₸",
      tenYear: "3.28 ₸"
    },
    {
      name: "Свободный денежный поток (Free Cash Flow)",
      description: "Показывает, сколько реальных денег остаётся у компании после всех операционных и капитальных расходов.",
      fiveYear: "73.4B ₸",
      tenYear: "42.1B ₸"
    },
    {
      name: "Чистая задолженность (Net Debt)",
      description: "Показывает, сколько долга остается у компании после вычета денежных средств.",
      fiveYear: "68.2B ₸",
      tenYear: "95.7B ₸"
    },
    {
      name: "Количество акций в обращении (Shares Outstanding)",
      description: "Показывает, размываются ли доли акционеров или компания выкупает свои акции.",
      fiveYear: "15.6B",
      tenYear: "18.3B"
    }
  ]

  const mainMetrics = [
    { name: "Рост выручки (Revenue Growth)", description: "Показывает, с какой скоростью увеличиваются продажи компании.", value: "8.2%" },
    { name: "Чистая маржа (Net Profit Margin)", description: "Показывает, какую часть выручки компания превращает в чистую прибыль.", value: "25.3%" },
    { name: "Рентабельность собственного капитала (ROE)", description: "Показывает, насколько эффективно компания использует деньги акционеров.", value: "147.4%" },
    { name: "Коэффициент текущей ликвидности (Current Ratio)", description: "Показывает, может ли компания покрыть краткосрочные обязательства своими текущими активами.", value: "1.13" },
    { name: "Долг к капиталу (Debt-to-Equity)", description: "Показывает, насколько компания зависит от заёмных средств по сравнению с собственным капиталом.", value: "1.73" },
    { name: "Маржа свободного денежного потока (FCF Margin)", description: "Показывает, какая часть выручки превращается в реальные деньги, а не бухгалтерскую прибыль.", value: "29.1%" },
    { name: "Рост прибыли на акцию (EPS Growth)", description: "Показывает, увеличивается ли прибыль, приходящаяся на одного акционера.", value: "11.5%" },
    { name: "Цена к прибыли (P/E)", description: "Показывает, сколько инвесторы платят за одну единицу прибыли компании.", value: "29.4" }
  ]

  const additionalMetrics = [
    { name: "Операционная маржа (Operating Margin)", description: "Показывает эффективность основного бизнеса без учета налогов и разовых факторов.", value: "30.5%" },
    { name: "Рентабельность активов (ROA)", description: "Показывает, насколько эффективно компания использует свои активы для получения прибыли.", value: "22.4%" },
    { name: "Покрытие процентов (Interest Coverage)", description: "Показывает, насколько легко компания может обслуживать проценты по своему долгу.", value: "28.6x" },
    { name: "Дивидендная доходность (Dividend Yield)", description: "Показывает, какой денежный доход получает инвестор в виде дивидендов.", value: "0.5%" },
    { name: "Коэффициент выплаты дивидендов (Payout Ratio)", description: "Показывает, какая часть прибыли направляется на выплату дивидендов.", value: "14.7%" },
    { name: "Цена к балансовой стоимости (P/B)", description: "Сравнивает рыночную стоимость компании с её балансовой (учетной) стоимостью.", value: "43.5" }
  ]

  const appleNews = [
    {
      title: "Apple (AAPL) Explores Partnership with India's CG Semi for Chip Assembly",
      source: "GuruFocus.com",
      time: "1 час назад"
    },
    {
      title: "Apple plans major iPhone expansion with seven models by 2027",
      source: "Investing.com",
      time: "3 часа назад"
    },
    {
      title: "Apple Fitness+ expands to 28 new markets",
      source: "Apple Newsroom",
      time: "6 часов назад"
    }
  ]

  const techCompanies = ["NVIDIA", "Apple", "Microsoft", "Alphabet (Google)", "Amazon"]

  const nextMetric = () => {
    setCurrentMetricIndex((prev) => (prev + 1) % metrics.length)
  }

  const prevMetric = () => {
    setCurrentMetricIndex((prev) => (prev - 1 + metrics.length) % metrics.length)
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="container-max py-20">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/invest/stocks"
            className="flex items-center text-finovate-orange hover:text-finovate-orange-hover font-semibold text-lg transition-colors"
          >
            ← Назад к списку акций
          </Link>
        </motion.div>

        {/* Stock Overview */}
        <div className="grid lg:grid-cols-10 gap-8 mb-8">
          {/* Company Info - 30% */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 p-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-bold text-finovate-navy">{companyData.symbol}</span>
                <Tooltip content={techCompanies.map(c => `• ${c}`).join('\n')}>
                  <span className="bg-finovate-orange-light text-finovate-orange px-3 py-1 rounded-full text-sm font-semibold cursor-help">
                    {companyData.sector}
                  </span>
                </Tooltip>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed">
                {companyData.description}
              </p>
            </div>
          </div>

          {/* Chart Section - 70% */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-finovate-navy">{companyData.name} ({companyData.symbol})</h3>
                <p className="text-2xl font-semibold text-finovate-orange">${companyData.price} (+{companyData.change}%)</p>
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

            {/* Search Bar */}
            <div className="relative w-full mb-6">
              <input
                type="text"
                placeholder="Поиск других акций..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-finovate-orange focus:border-finovate-orange"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <SearchIcon />
              </div>
            </div>

            {/* Placeholder Chart */}
            <div className="bg-gray-50 rounded-xl h-48 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 17V3h14v14H3zm2-2h10V5H5v10z"/>
                </svg>
                <p>График {companyData.name}</p>
                <p className="text-sm">Период: {timeFrame}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Historical Metrics Slider */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-finovate-navy text-center">Исторические показатели</h3>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 relative">
            {/* Left Arrow */}
            <button
              onClick={prevMetric}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-lg bg-white hover:bg-gray-200 transition-colors shadow-md z-10"
            >
              ←
            </button>

            {/* Right Arrow */}
            <button
              onClick={nextMetric}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-lg bg-white hover:bg-gray-200 transition-colors shadow-md z-10"
            >
              →
            </button>

            <div className="grid md:grid-cols-3 gap-6 mx-16">
              <div>
                <h4 className="font-bold text-finovate-navy mb-2">{metrics[currentMetricIndex].name}</h4>
                <p className="text-gray-600 text-sm">{metrics[currentMetricIndex].description}</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-finovate-orange">{metrics[currentMetricIndex].fiveYear}</div>
                <div className="text-sm text-gray-500">5 лет назад</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-finovate-orange">{metrics[currentMetricIndex].tenYear}</div>
                <div className="text-sm text-gray-500">10 лет назад</div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Metrics - Full Width */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-bold text-finovate-navy mb-4">Основные показатели</h3>
          <div className="grid grid-cols-4 gap-4">
            {mainMetrics.map((metric, index) => (
              <Tooltip key={index} content={metric.description}>
                <div className="bg-gray-50 p-4 rounded-xl cursor-help hover:bg-gray-100 transition-colors">
                  <div className="text-sm text-gray-600 mb-1">{metric.name}</div>
                  <div className="text-xl font-bold text-finovate-navy">{metric.value}</div>
                </div>
              </Tooltip>
            ))}
          </div>

          <button
            onClick={() => setShowAdditionalMetrics(!showAdditionalMetrics)}
            className="mt-4 w-full bg-finovate-orange text-white py-2 rounded-xl hover:bg-finovate-orange-hover transition-colors"
          >
            {showAdditionalMetrics ? 'Скрыть дополнительные показатели' : 'Показать дополнительные показатели'}
          </button>

          <AnimatePresence>
            {showAdditionalMetrics && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4"
              >
                <div className="grid grid-cols-3 gap-4">
                  {additionalMetrics.map((metric, index) => (
                    <Tooltip key={index} content={metric.description}>
                      <div className="bg-gray-50 p-4 rounded-xl cursor-help hover:bg-gray-100 transition-colors">
                        <div className="text-sm text-gray-600 mb-1">{metric.name}</div>
                        <div className="text-xl font-bold text-finovate-navy">{metric.value}</div>
                      </div>
                    </Tooltip>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* News Section - Full Width */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-finovate-navy">Новости {companyData.name}</h3>
            <button className="text-finovate-orange font-semibold hover:text-finovate-orange-hover">
              Увидеть больше
            </button>
          </div>

          <div className="space-y-4">
            {appleNews.map((news, index) => (
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
      </div>
    </main>
  )
}