'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProfile } from '@/store/profileStore'
import PieChart from '@/components/PieChart'

interface PieChartData {
  name: string
  value: number
  color: string
  percentage: number
}

const TYPE_COLORS = {
  stock: '#10B981',
  bond: '#3B82F6',
  etf: '#F59E0B'
}

const SECTOR_COLORS = {
  Technology: '#8B5CF6',
  Financials: '#EF4444',
  Industrials: '#06B6D4',
  Energy: '#F97316',
  Consumer: '#84CC16',
  Other: '#6B7280'
}

const BOND_TYPE_COLORS = {
  Government: '#3B82F6',
  Corporate: '#10B981',
  Municipal: '#F59E0B',
  Other: '#6B7280'
}

const ETF_TYPE_COLORS = {
  Index: '#8B5CF6',
  Equity: '#10B981',
  Sector: '#F59E0B',
  Commodity: '#EF4444',
  Thematic: '#06B6D4',
  Other: '#6B7280'
}

export default function PortfolioPage() {
  const { state, dispatch } = useProfile()
  const [selectedSegment, setSelectedSegment] = useState<PieChartData | null>(null)
  const [showResetModal, setShowResetModal] = useState(false)

  // Конвертация USD в KZT (примерный курс)
  const usdToKzt = 470

  const pieChartData = useMemo(() => {
    const typeGroups = state.portfolio.positions.reduce((acc, position) => {
      const type = position.type
      if (!acc[type]) {
        acc[type] = 0
      }
      acc[type] += position.marketValue
      return acc
    }, {} as Record<string, number>)

    const total = Object.values(typeGroups).reduce((sum, value) => sum + value, 0)

    return Object.entries(typeGroups).map(([type, value]) => ({
      name: type === 'stock' ? 'Акции' : type === 'bond' ? 'Облигации' : 'ETF',
      value,
      color: TYPE_COLORS[type as keyof typeof TYPE_COLORS],
      percentage: (value / total) * 100
    }))
  }, [state.portfolio.positions])

  const getDetailData = (segment: PieChartData) => {
    const typeKey = segment.name === 'Акции' ? 'stock' : segment.name === 'Облигации' ? 'bond' : 'etf'
    const positions = state.portfolio.positions.filter(p => p.type === typeKey)

    if (typeKey === 'stock') {
      const sectorGroups = positions.reduce((acc, position) => {
        const sector = position.sector || 'Other'
        if (!acc[sector]) {
          acc[sector] = 0
        }
        acc[sector] += position.marketValue
        return acc
      }, {} as Record<string, number>)

      const total = Object.values(sectorGroups).reduce((sum, value) => sum + value, 0)
      return Object.entries(sectorGroups).map(([sector, value]) => ({
        name: sector,
        value,
        percentage: (value / total) * 100
      }))
    } else if (typeKey === 'bond') {
      const bondTypeGroups = positions.reduce((acc, position) => {
        const bondType = position.bondType || 'Other'
        if (!acc[bondType]) {
          acc[bondType] = 0
        }
        acc[bondType] += position.marketValue
        return acc
      }, {} as Record<string, number>)

      const total = Object.values(bondTypeGroups).reduce((sum, value) => sum + value, 0)
      return Object.entries(bondTypeGroups).map(([bondType, value]) => ({
        name: bondType,
        value,
        percentage: (value / total) * 100
      }))
    } else {
      const etfTypeGroups = positions.reduce((acc, position) => {
        const etfType = position.etfType || 'Other'
        if (!acc[etfType]) {
          acc[etfType] = 0
        }
        acc[etfType] += position.marketValue
        return acc
      }, {} as Record<string, number>)

      const total = Object.values(etfTypeGroups).reduce((sum, value) => sum + value, 0)
      return Object.entries(etfTypeGroups).map(([etfType, value]) => ({
        name: etfType,
        value,
        percentage: (value / total) * 100
      }))
    }
  }

  const handleResetPortfolio = () => {
    dispatch({ type: 'RESET_PORTFOLIO' })
    setShowResetModal(false)
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
              Войдите в систему для доступа к портфелю
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-finovate-white to-finovate-orange-hover pt-20">
      <div className="container-max py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-finovate-navy">Мой портфель</h1>
            <p className="text-gray-600">Демо-счет для изучения инвестиций</p>
          </div>

          <button
            onClick={() => setShowResetModal(true)}
            className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
          >
            Сбросить портфель
          </button>
        </motion.div>

        {/* Portfolio Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-8"
        >
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-finovate-navy mb-2">
                ${state.portfolio.totalValue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 mb-1">
                ₸{(state.portfolio.totalValue * usdToKzt).toLocaleString()}
              </div>
              <div className="text-gray-600">Общая стоимость</div>
            </div>

            <div className="text-center">
              <div className={`text-3xl font-bold mb-2 ${
                state.portfolio.totalPnl >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ${state.portfolio.totalPnl.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 mb-1">
                ₸{(state.portfolio.totalPnl * usdToKzt).toLocaleString()}
              </div>
              <div className="text-gray-600">P/L за месяц</div>
            </div>

            <div className="text-center">
              <div className={`text-3xl font-bold mb-2 ${
                state.portfolio.totalPnlPercent >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {state.portfolio.totalPnlPercent.toFixed(2)}%
              </div>
              <div className="text-gray-600">Доходность</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-finovate-navy mb-2">
                ${state.portfolio.cash.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 mb-1">
                ₸{(state.portfolio.cash * usdToKzt).toLocaleString()}
              </div>
              <div className="text-gray-600">Свободные средства</div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Portfolio Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-finovate-navy mb-6">Структура портфеля</h2>

            {pieChartData.length > 0 ? (
              <PieChart
                data={pieChartData}
                selectedSegment={selectedSegment}
                onSegmentSelect={setSelectedSegment}
              />
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <p className="text-gray-500 mb-2">Портфель пуст</p>
                <p className="text-sm text-gray-400">Добавьте позиции для просмотра структуры</p>
              </div>
            )}
          </motion.div>

          {/* Detail View */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-finovate-navy mb-6">
              {selectedSegment ? `Детализация: ${selectedSegment.name}` : 'Все позиции'}
            </h2>

            <AnimatePresence mode="wait">
              {selectedSegment ? (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {getDetailData(selectedSegment).map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center">
                        <div className="text-left">
                          <div className="font-semibold text-finovate-navy">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-finovate-navy">
                          ${item.value.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          ₸{(item.value * usdToKzt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="all-positions"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {state.portfolio.positions.length > 0 ? (
                    state.portfolio.positions.map((position) => (
                      <div key={position.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <div className="font-semibold text-finovate-navy">
                            {position.symbol}
                          </div>
                          <div className="text-sm text-gray-500">{position.name}</div>
                          <div className="text-xs text-gray-400">
                            {position.quantity} шт. × ${position.currentPrice}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-finovate-navy">
                            ${position.marketValue.toLocaleString()}
                          </div>
                          <div className={`text-sm ${position.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {position.pnl >= 0 ? '+' : ''}${position.pnl.toLocaleString()} ({position.pnlPercent.toFixed(2)}%)
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4m16 0l-2-2-2 2m0 0l2-2-2-2" />
                        </svg>
                      </div>
                      <p className="text-gray-500 mb-2">Нет позиций в портфеле</p>
                      <p className="text-sm text-gray-400">Используйте свободные средства для покупки активов</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-xl p-8 mt-8"
        >
          <h2 className="text-2xl font-bold text-finovate-navy mb-6">История сделок</h2>

          {state.portfolio.transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Дата</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Тикер</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Тип</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Количество</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Цена</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Сумма</th>
                  </tr>
                </thead>
                <tbody>
                  {state.portfolio.transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {new Date(transaction.date).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="py-3 px-4 font-semibold">{transaction.symbol}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          transaction.type === 'buy' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type === 'buy' ? 'Покупка' : 'Продажа'}
                        </span>
                      </td>
                      <td className="py-3 px-4">{transaction.quantity}</td>
                      <td className="py-3 px-4">${transaction.price}</td>
                      <td className="py-3 px-4 font-semibold">
                        ${transaction.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-gray-500 mb-2">Нет сделок</p>
              <p className="text-sm text-gray-400">История транзакций появится после первых операций</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Reset Portfolio Modal */}
      <AnimatePresence>
        {showResetModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full mx-4"
            >
              <h3 className="text-xl font-bold text-finovate-navy mb-4">
                Сброс демо-портфеля
              </h3>
              <p className="text-gray-600 mb-6">
                Вы уверены, что хотите сбросить портфель? Это действие нельзя отменить.
                Вы получите новый демо-портфель с начальным балансом 3000 USD.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={handleResetPortfolio}
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
                >
                  Да, сбросить
                </button>
                <button
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}