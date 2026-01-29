'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

// Иконки компонентов
const StockIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
    <path d="M3 3v14l6-2 6 2V3l-6 2-6-2z"/>
  </svg>
)

const BondIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
    <path d="M4 4h12v12H4V4zm2 2v8h8V6H6z"/>
  </svg>
)

const ETFIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
    <path d="M2 4h16v12H2V4zm2 2v8h12V6H4z"/>
  </svg>
)

export default function InvestmentPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container-max py-20">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-finovate-navy mb-6">
            Инвестиционная часть
          </h1>
          <p className="text-lg text-finovate-navy max-w-4xl mx-auto leading-relaxed">
            Этот раздел объясняет основные принципы работы инвестиционных инструментов. Он создан не только для визуального анализа активов, но и для формирования мышления того, как принимаются инвестиционные решения. Используйте инвестиции как инструмент роста, сохраняя свой капитал. Ниже предоставлены основные инвестиционные инструменты.
          </p>
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-8 mb-20"
        >
          {/* Stocks Button */}
          <motion.div whileHover={{ y: -5, scale: 1.02 }}>
            <Link href="/invest/stocks" className="block">
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl border-2 border-gray-200 p-8 hover:border-finovate-orange hover:shadow-2xl transition-all duration-300 w-80 h-64 flex flex-col justify-center items-center group">
                <div className="bg-finovate-orange-light p-6 rounded-2xl mb-6 group-hover:bg-finovate-orange group-hover:text-white transition-all duration-300">
                  <StockIcon />
                </div>
                <h3 className="text-3xl font-bold text-finovate-navy mb-4 group-hover:text-finovate-orange transition-colors">Акции</h3>
                <p className="text-gray-600 text-center leading-relaxed text-sm">
                  Анализируйте и выбирайте акции для инвестиций
                </p>
                <div className="mt-4 text-finovate-orange font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Перейти →
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Bonds Button */}
          <motion.div whileHover={{ y: -5, scale: 1.02 }}>
            <Link href="/invest/bonds" className="block">
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl border-2 border-gray-200 p-8 hover:border-finovate-orange hover:shadow-2xl transition-all duration-300 w-80 h-64 flex flex-col justify-center items-center group">
                <div className="bg-finovate-orange-light p-6 rounded-2xl mb-6 group-hover:bg-finovate-orange group-hover:text-white transition-all duration-300">
                  <BondIcon />
                </div>
                <h3 className="text-3xl font-bold text-finovate-navy mb-4 group-hover:text-finovate-orange transition-colors">Облигации</h3>
                <p className="text-gray-600 text-center leading-relaxed text-sm">
                  Стабильные инструменты с фиксированным доходом
                </p>
                <div className="mt-4 text-finovate-orange font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Перейти →
                </div>
              </div>
            </Link>
          </motion.div>

          {/* ETF Button */}
          <motion.div whileHover={{ y: -5, scale: 1.02 }}>
            <Link href="/invest/etf" className="block">
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl border-2 border-gray-200 p-8 hover:border-finovate-orange hover:shadow-2xl transition-all duration-300 w-80 h-64 flex flex-col justify-center items-center group">
                <div className="bg-finovate-orange-light p-6 rounded-2xl mb-6 group-hover:bg-finovate-orange group-hover:text-white transition-all duration-300">
                  <ETFIcon />
                </div>
                <h3 className="text-3xl font-bold text-finovate-navy mb-4 group-hover:text-finovate-orange transition-colors">ETF</h3>
                <p className="text-gray-600 text-center leading-relaxed text-sm">
                  Диверсифицированные фонды для снижения рисков
                </p>
                <div className="mt-4 text-finovate-orange font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Перейти →
                </div>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Education Blocks */}
      <div className="space-y-12 pb-20">
        {/* Stocks Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="bg-finovate-navy rounded-3xl p-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-orange-500 mb-12">Акции</h2>

              <div className="space-y-8 text-left max-w-4xl mx-auto">
                <div>
                  <h3 className="text-xl font-semibold text-finovate-orange mb-4">Что такое акции?</h3>
                  <p className="text-white leading-relaxed">
                    Это доля в компании. Покупая акцию, вы становитесь её совладельцем; прибыль приходит с ростом компании, убытки — при падении.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-finovate-orange mb-4">Зачем люди инвестируют в акции</h3>
                  <ul className="text-white space-y-2 leading-relaxed">
                    <li>● Долгосрочный рост капитала</li>
                    <li>● Более высокий потенциал отдачи</li>
                    <li>● Доля собственности и влияние в организации</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-finovate-orange mb-4">Как выбрать и на что обратить внимание</h3>
                  <ul className="text-white space-y-2 leading-relaxed">
                    <li>● Выбирайте сильные и перспективные компании</li>
                    <li>● Анализируйте новости и финансовую устойчивость</li>
                    <li>● Диверсифицируйте портфель по секторам</li>
                    <li>● Будьте спокойны при колебаниях рынка</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bonds Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="bg-finovate-navy rounded-3xl p-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-orange-500 mb-12">Облигации</h2>

              <div className="space-y-8 text-left max-w-4xl mx-auto">
                <div>
                  <h3 className="text-xl font-semibold text-finovate-orange mb-4">Что такое облигации?</h3>
                  <p className="text-white leading-relaxed">
                    Это займы государству или компаниям с фиксированным доходом и возвратом средств в конце срока.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-finovate-orange mb-4">Зачем люди инвестируют в облигации</h3>
                  <ul className="text-white space-y-2 leading-relaxed">
                    <li>● Более высокая стабильность</li>
                    <li>● Предсказуемый доход</li>
                    <li>● Более низкий риск по сравнению с акциями</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-finovate-orange mb-4">Как выбрать и на что обратить внимание</h3>
                  <ul className="text-white space-y-2 leading-relaxed">
                    <li>● Отдавайте предпочтение надежным эмитентам</li>
                    <li>● Учитывайте срок погашения (короче срок — ниже риск)</li>
                    <li>● Обращайте особое внимание на процентную ставку</li>
                    <li>● Используйте облигации для снижения общего риска портфеля</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ETF Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="bg-finovate-navy rounded-3xl p-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-orange-500 mb-12">ETF</h2>

              <div className="space-y-8 text-left max-w-4xl mx-auto">
                <div>
                  <h3 className="text-xl font-semibold text-finovate-orange mb-4">Что такое ETF?</h3>
                  <p className="text-white leading-relaxed">
                    Это фонды, которые отслеживают индекс или группу активов и торгуются на бирже как обычные акции.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-finovate-orange mb-4">Зачем люди инвестируют в ETF</h3>
                  <ul className="text-white space-y-2 leading-relaxed">
                    <li>● Более низкий риск по сравнению с отдельными акциями</li>
                    <li>● Простая и доступная диверсификация</li>
                    <li>● Прозрачность и легкость структуры</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-finovate-orange mb-4">Как выбрать и на что обратить внимание</h3>
                  <ul className="text-white space-y-2 leading-relaxed">
                    <li>● Проверьте, какие активы входят в состав ETF</li>
                    <li>● Выбирайте крупные и ликвидные фонды</li>
                    <li>● Обратите внимание на комиссии фонда</li>
                    <li>● Лучше всего подходят для долгосрочного инвестирования</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}