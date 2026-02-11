
'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Интерфейсы
interface Transaction {
  id: string
  name: string
  amount: number
  category: string
  type: 'income' | 'expense'
  date: string
  month: number
  year: number
}

interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  monthlyContribution: number
  deadline: string
  initialPayment?: number
}

interface HistoricalData {
  month: number
  year: number
  income: number
  expense: number
}

// Категории с цветами для диаграммы
const EXPENSE_CATEGORIES = {
  utilities: { name: 'Коммунальные услуги', color: '#F28B30' },
  telecom: { name: 'Связь', color: '#5A6CF5' },
  food: { name: 'Питание', color: '#10B981' },
  transport: { name: 'Транспорт', color: '#F59E0B' },
  entertainment: { name: 'Развлечения', color: '#EF4444' },
  other: { name: 'Прочее', color: '#8B5CF6' }
}

// Иконки
const IncomeIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
)

const ExpenseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
  </svg>
)

const UploadIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
)

const GoalIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
)

const ChartIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
)

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

// Компонент линейного графика
const LineChart = ({ historicalData, timeframe }: {
  historicalData: HistoricalData[],
  timeframe: 'months' | 'years'
}) => {
  const processedData = timeframe === 'months'
    ? historicalData.slice(-12) // Последние 12 месяцев
    : historicalData.reduce((acc, item) => {
        const existingYear = acc.find(y => y.year === item.year)
        if (existingYear) {
          existingYear.income += item.income
          existingYear.expense += item.expense
        } else {
          acc.push({
            year: item.year,
            month: 0,
            income: item.income,
            expense: item.expense
          })
        }
        return acc
      }, [] as HistoricalData[]).slice(-5) // Последние 5 лет

  const maxValue = Math.max(
    ...processedData.map(d => Math.max(d.income, d.expense))
  )

  return (
    <div className="bg-gray-50 rounded-xl p-6 h-64 flex items-center justify-center">
      {processedData.length === 0 ? (
        <div className="text-center text-gray-500">
          <ChartIcon />
          <p className="mt-2">Недостаточно данных для графика</p>
          <p className="text-sm">Добавьте исторические данные в разделе "Бюджет"</p>
        </div>
      ) : (
        <div className="w-full h-full relative">
          <svg width="100%" height="100%" className="overflow-visible">
            {processedData.map((point, index) => {
              const x = (index / (processedData.length - 1)) * 90 + 5
              const yIncome = 85 - (point.income / maxValue) * 70
              const yExpense = 85 - (point.expense / maxValue) * 70

              return (
                <g key={index}>
                  {/* Точки доходов */}
                  <circle
                    cx={`${x}%`}
                    cy={`${yIncome}%`}
                    r="4"
                    fill="#10B981"
                    className="hover:r-6 transition-all cursor-pointer"
                  />
                  {/* Точки расходов */}
                  <circle
                    cx={`${x}%`}
                    cy={`${yExpense}%`}
                    r="4"
                    fill="#EF4444"
                    className="hover:r-6 transition-all cursor-pointer"
                  />

                  {/* Линии */}
                  {index > 0 && (
                    <>
                      <line
                        x1={`${((index - 1) / (processedData.length - 1)) * 90 + 5}%`}
                        y1={`${85 - (processedData[index - 1].income / maxValue) * 70}%`}
                        x2={`${x}%`}
                        y2={`${yIncome}%`}
                        stroke="#10B981"
                        strokeWidth="2"
                      />
                      <line
                        x1={`${((index - 1) / (processedData.length - 1)) * 90 + 5}%`}
                        y1={`${85 - (processedData[index - 1].expense / maxValue) * 70}%`}
                        x2={`${x}%`}
                        y2={`${yExpense}%`}
                        stroke="#EF4444"
                        strokeWidth="2"
                      />
                    </>
                  )}

                  {/* Подписи */}
                  <text
                    x={`${x}%`}
                    y="95%"
                    textAnchor="middle"
                    className="text-xs fill-gray-600"
                  >
                    {timeframe === 'months'
                      ? `${String(point.month).padStart(2, '0')}.${point.year}`
                      : point.year
                    }
                  </text>
                </g>
              )
            })}
          </svg>

          {/* Легенда */}
          <div className="absolute top-2 right-2 flex space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Доходы</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Расходы</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function TrackerPage() {
  const [activeTab, setActiveTab] = useState<'budget' | 'analytics' | 'goals'>('budget')
  const [goalsTab, setGoalsTab] = useState<'active' | 'completed'>('active')
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month')
  const [timeframe, setTimeframe] = useState<'months' | 'years'>('months')
  const [showAddIncome, setShowAddIncome] = useState(false)
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [showAddHistorical, setShowAddHistorical] = useState(false)
  const [editingGoal, setEditingGoal] = useState<string | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [showCustomInput, setShowCustomInput] = useState<string | null>(null)

  // Форма создания цели
  const [goalForm, setGoalForm] = useState({
    name: '',
    targetAmount: '',
    monthlyContribution: '',
    deadline: '',
    initialPayment: ''
  })

  // Форма добавления исторических данных
  const [historicalForm, setHistoricalForm] = useState({
    type: 'expense' as 'income' | 'expense',
    name: '',
    amount: '',
    category: 'other',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Состояние для транзакций с датами
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      name: 'Зарплата',
      amount: 500000,
      category: 'salary',
      type: 'income',
      date: new Date().toISOString(),
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    },
    {
      id: '2',
      name: 'Коммунальные услуги',
      amount: 45000,
      category: 'utilities',
      type: 'expense',
      date: new Date().toISOString(),
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    },
    {
      id: '3',
      name: 'Мобильная связь',
      amount: 8000,
      category: 'telecom',
      type: 'expense',
      date: new Date().toISOString(),
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    },
    {
      id: '4',
      name: 'Еда и напитки',
      amount: 120000,
      category: 'food',
      type: 'expense',
      date: new Date().toISOString(),
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    }
  ])

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      name: 'Первоначальный взнос на квартиру',
      targetAmount: 5000000,
      currentAmount: 5000000,
      monthlyContribution: 150000,
      deadline: '2025-12-31',
      initialPayment: 200000
    },
    {
      id: '2',
      name: 'Отпуск в Европе',
      targetAmount: 800000,
      currentAmount: 400000,
      monthlyContribution: 80000,
      deadline: '2025-06-30'
    }
  ])

  // Генерация исторических данных (можно заменить на реальные данные из базы)
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>(() => {
    const data: HistoricalData[] = []
    const currentDate = new Date()

    // Создаем данные за последние 12 месяцев
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      data.push({
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        income: Math.floor(Math.random() * 200000) + 400000, // 400k-600k
        expense: Math.floor(Math.random() * 100000) + 150000  // 150k-250k
      })
    }
    return data
  })

  // Вычисления для текущего периода
  const currentIncomes = transactions.filter(t => t.type === 'income')
  const currentExpenses = transactions.filter(t => t.type === 'expense')
  const totalIncome = currentIncomes.reduce((sum, item) => sum + item.amount, 0)
  const totalExpense = currentExpenses.reduce((sum, item) => sum + item.amount, 0)
  const balance = totalIncome - totalExpense

  // Данные для круговой диаграммы
  const expensesByCategory = currentExpenses.reduce((acc, expense) => {
    const category = expense.category
    if (!acc[category]) {
      acc[category] = 0
    }
    acc[category] += expense.amount
    return acc
  }, {} as Record<string, number>)

  const pieChartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: EXPENSE_CATEGORIES[category as keyof typeof EXPENSE_CATEGORIES]?.name || 'Прочее',
    value: amount,
    color: EXPENSE_CATEGORIES[category as keyof typeof EXPENSE_CATEGORIES]?.color || '#8B5CF6'
  }))

  // Фильтрация целей
  const activeGoals = goals.filter(goal => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100
    return progress < 100
  })

  const completedGoals = goals.filter(goal => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100
    return progress >= 100
  })

  // Обновление исторических данных при добавлении новых транзакций
  useEffect(() => {
    // Пересчитываем исторические данные из транзакций
    const dataByPeriod = transactions.reduce((acc, transaction) => {
      const key = `${transaction.year}-${transaction.month}`
      if (!acc[key]) {
        acc[key] = {
          month: transaction.month,
          year: transaction.year,
          income: 0,
          expense: 0
        }
      }

      if (transaction.type === 'income') {
        acc[key].income += transaction.amount
      } else {
        acc[key].expense += transaction.amount
      }

      return acc
    }, {} as Record<string, HistoricalData>)

    const updatedHistoricalData = Object.values(dataByPeriod).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year
      return a.month - b.month
    })

    if (updatedHistoricalData.length > 0) {
      setHistoricalData(updatedHistoricalData)
    }
  }, [transactions])

  // Функции для работы с транзакциями
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    setTransactions([...transactions, {
      ...transaction,
      id: Date.now().toString()
    }])
  }

  const removeTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id))
  }

  // Функции для целей
  const addGoal = (name: string, targetAmount: number, monthlyContribution: number, deadline: string, initialPayment?: number) => {
    setGoals([...goals, {
      id: Date.now().toString(),
      name,
      targetAmount,
      currentAmount: initialPayment || 0,
      monthlyContribution,
      deadline,
      initialPayment
    }])
  }

  const updateGoal = (id: string, updatedGoal: Partial<Goal>) => {
    setGoals(goals.map(goal =>
      goal.id === id ? { ...goal, ...updatedGoal } : goal
    ))
  }

  const addToGoal = (goalId: string, amount: number) => {
    setGoals(goals.map(goal =>
      goal.id === goalId
        ? { ...goal, currentAmount: Math.min(goal.currentAmount + amount, goal.targetAmount) }
        : goal
    ))
  }

  // Обработчики форм
  const handleGoalFormChange = (field: string, value: string) => {
    const newForm = { ...goalForm, [field]: value }
    setGoalForm(newForm)
  }

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!goalForm.name || !goalForm.targetAmount) {
      alert('Пожалуйста, заполните название цели и целевую сумму')
      return
    }
    if (!goalForm.monthlyContribution && !goalForm.deadline) {
      alert('Пожалуйста, заполните либо ежемесячный взнос, либо дату дедлайна')
      return
    }

    addGoal(
      goalForm.name,
      Number(goalForm.targetAmount),
      Number(goalForm.monthlyContribution),
      goalForm.deadline,
      Number(goalForm.initialPayment) || undefined
    )

    setGoalForm({
      name: '',
      targetAmount: '',
      monthlyContribution: '',
      deadline: '',
      initialPayment: ''
    })
    setShowAddGoal(false)
  }

  const handleHistoricalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const currentDate = new Date()

    addTransaction({
      name: historicalForm.name,
      amount: Number(historicalForm.amount),
      category: historicalForm.category,
      type: historicalForm.type,
      date: new Date(historicalForm.year, historicalForm.month - 1, 1).toISOString(),
      month: historicalForm.month,
      year: historicalForm.year
    })

    setHistoricalForm({
      type: 'expense',
      name: '',
      amount: '',
      category: 'other',
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear()
    })
    setShowAddHistorical(false)
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const processFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      alert(`Файл ${file.name} загружен! (функция обработки будет добавлена позже)`)
    }
  }

  const handleCustomContribution = (goalId: string) => {
    const amount = Number(customAmount)
    if (amount > 0) {
      addToGoal(goalId, amount)
      setCustomAmount('')
      setShowCustomInput(null)
    }
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

        {/* Tab Switcher */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-white rounded-2xl p-2 flex space-x-2 shadow-lg">
            <button
              onClick={() => setActiveTab('budget')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'budget'
                  ? 'bg-finovate-orange text-white shadow-lg'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Бюджет
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-finovate-orange text-white shadow-lg'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Аналитика
            </button>
            <button
              onClick={() => setActiveTab('goals')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'goals'
                  ? 'bg-finovate-orange text-white shadow-lg'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Цели
            </button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Бюджет */}
          {activeTab === 'budget' && (
            <motion.div
              key="budget"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Баланс */}
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <h2 className="text-2xl font-bold text-finovate-navy mb-6 text-center">Текущий баланс</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-green-50 rounded-2xl">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {totalIncome.toLocaleString()} тг
                    </div>
                    <div className="text-gray-600">Доходы</div>
                  </div>
                  <div className="text-center p-6 bg-red-50 rounded-2xl">
                    <div className="text-3xl font-bold text-red-600 mb-2">
                      {totalExpense.toLocaleString()} тг
                    </div>
                    <div className="text-gray-600">Расходы</div>
                  </div>
                  <div className="text-center p-6 bg-finovate-orange-light rounded-2xl">
                    <div className={`text-3xl font-bold mb-2 ${balance >= 0 ? 'text-finovate-orange' : 'text-red-600'}`}>
                      {balance.toLocaleString()} тг
                    </div>
                    <div className="text-gray-600">Баланс</div>
                  </div>
                </div>
              </div>

              {/* Добавление данных за прошлые периоды */}
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-finovate-navy">Исторические данные</h2>
                  <button
                    onClick={() => setShowAddHistorical(true)}
                    className="bg-finovate-orange text-white px-6 py-3 rounded-xl font-semibold hover:bg-finovate-orange-hover transition-colors flex items-center space-x-2"
                  >
                    <PlusIcon />
                    <span>Добавить данные за прошлый период</span>
                  </button>
                </div>

                <p className="text-gray-600 mb-6">
                  Добавляйте доходы и расходы за предыдущие месяцы для построения полной картины ваших финансов
                </p>

                {/* Форма добавления исторических данных */}
                <AnimatePresence>
                  {showAddHistorical && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-gray-50 rounded-2xl p-6 mb-6"
                    >
                      <h3 className="text-lg font-semibold text-finovate-navy mb-4">
                        Добавить данные за прошлый период
                      </h3>
                      <form onSubmit={handleHistoricalSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Тип операции
                            </label>
                            <select
                              value={historicalForm.type}
                              onChange={(e) => setHistoricalForm({
                                ...historicalForm,
                                type: e.target.value as 'income' | 'expense'
                              })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-finovate-orange focus:border-finovate-orange"
                            >
                              <option value="expense">Расход</option>
                              <option value="income">Доход</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Категория
                            </label>
                            <select
                              value={historicalForm.category}
                              onChange={(e) => setHistoricalForm({
                                ...historicalForm,
                                category: e.target.value
                              })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-finovate-orange focus:border-finovate-orange"
                            >
                              {historicalForm.type === 'expense' ? (
                                <>
                                  <option value="utilities">Коммунальные услуги</option>
                                  <option value="telecom">Связь</option>
                                  <option value="food">Питание</option>
                                  <option value="transport">Транспорт</option>
                                  <option value="entertainment">Развлечения</option>
                                  <option value="other">Прочее</option>
                                </>
                              ) : (
                                <>
                                  <option value="salary">Зарплата</option>
                                  <option value="business">Бизнес</option>
                                  <option value="investments">Инвестиции</option>
                                  <option value="other">Прочее</option>
                                </>
                              )}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Название
                          </label>
                          <input
                            type="text"
                            value={historicalForm.name}
                            onChange={(e) => setHistoricalForm({
                              ...historicalForm,
                              name: e.target.value
                            })}
                            placeholder="Например: Коммунальные платежи за январь"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-finovate-orange focus:border-finovate-orange"
                            required
                          />
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Сумма (тг)
                            </label>
                            <input
                              type="number"
                              value={historicalForm.amount}
                              onChange={(e) => setHistoricalForm({
                                ...historicalForm,
                                amount: e.target.value
                              })}
                              placeholder="0"
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-finovate-orange focus:border-finovate-orange"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Месяц
                            </label>
                            <select
                              value={historicalForm.month}
                              onChange={(e) => setHistoricalForm({
                                ...historicalForm,
                                month: Number(e.target.value)
                              })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-finovate-orange focus:border-finovate-orange"
                            >
                              {Array.from({length: 12}, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                  {new Date(2024, i).toLocaleString('ru', { month: 'long' })}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Год
                            </label>
                            <select
                              value={historicalForm.year}
                              onChange={(e) => setHistoricalForm({
                                ...historicalForm,
                                year: Number(e.target.value)
                              })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-finovate-orange focus:border-finovate-orange"
                            >
                              {Array.from({length: 5}, (_, i) => {
                                const year = new Date().getFullYear() - i
                                return <option key={year} value={year}>{year}</option>
                              })}
                            </select>
                          </div>
                        </div>

                        <div className="flex space-x-4">
                          <button
                            type="submit"
                            className="flex-1 bg-finovate-orange text-white py-3 rounded-xl font-semibold hover:bg-finovate-orange-hover transition-colors"
                          >
                            Добавить
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowAddHistorical(false)}
                            className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                          >
                            Отмена
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Загрузка файла */}
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-finovate-orange-light rounded-xl flex items-center justify-center">
                    <UploadIcon />
                  </div>
                  <h2 className="text-2xl font-bold text-finovate-navy">Загрузка файла транзакций</h2>
                </div>

                <p className="text-gray-600 text-center mb-6">
                  Загрузите файл с вашими транзакциями для автоматического распределения доходов и расходов
                </p>

                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 hover:border-finovate-orange transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={processFile}
                    accept=".csv,.xlsx,.xls"
                    className="hidden"
                  />
                  <div className="text-center">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-600 mb-4">Перетащите файл сюда или</p>
                    <button
                      onClick={handleFileUpload}
                      className="bg-finovate-orange text-white px-6 py-3 rounded-xl font-semibold hover:bg-finovate-orange-hover transition-colors"
                    >
                      Выберите файл
                    </button>
                    <p className="text-sm text-gray-500 mt-4">
                      Поддерживаемые форматы: CSV, Excel (.xlsx, .xls) • Макс. размер: 10 МБ
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Доходы */}
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 p-3 rounded-xl">
                        <IncomeIcon />
                      </div>
                      <h3 className="text-2xl font-bold text-finovate-navy">Доходы</h3>
                    </div>
                    <button
                      onClick={() => setShowAddIncome(true)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Добавить
                    </button>
                  </div>

                  <div className="space-y-3">
                    {currentIncomes.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                        <span className="font-medium text-gray-700">{item.name}</span>
                        <div className="flex items-center space-x-3">
                          <span className="font-bold text-green-600">{item.amount.toLocaleString()} тг</span>
                          <button
                            onClick={() => removeTransaction(item.id)}
                            className="text-red-500 hover:text-red-700 text-xl"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Форма добавления дохода */}
                  <AnimatePresence>
                    {showAddIncome && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 p-4 bg-gray-50 rounded-xl"
                      >
                        <form
                          onSubmit={(e) => {
                            e.preventDefault()
                            const formData = new FormData(e.target as HTMLFormElement)
                            const name = formData.get('name') as string
                            const amount = Number(formData.get('amount'))
                            const currentDate = new Date()

                            addTransaction({
                              name,
                              amount,
                              category: 'other',
                              type: 'income',
                              date: currentDate.toISOString(),
                              month: currentDate.getMonth() + 1,
                              year: currentDate.getFullYear()
                            })
                            setShowAddIncome(false)
                          }}
                          className="space-y-3"
                        >
                          <input
                            type="text"
                            name="name"
                            placeholder="Название дохода"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            required
                          />
                          <input
                            type="number"
                            name="amount"
                            placeholder="Сумма в тенге"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            required
                          />
                          <div className="flex space-x-2">
                            <button
                              type="submit"
                              className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
                            >
                              Добавить
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowAddIncome(false)}
                              className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                            >
                              Отмена
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Расходы */}
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="bg-red-100 p-3 rounded-xl">
                        <ExpenseIcon />
                      </div>
                      <h3 className="text-2xl font-bold text-finovate-navy">Расходы</h3>
                    </div>
                    <button
                      onClick={() => setShowAddExpense(true)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Добавить
                    </button>
                  </div>

                  <div className="space-y-3">
                    {currentExpenses.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                        <span className="font-medium text-gray-700">{item.name}</span>
                        <div className="flex items-center space-x-3">
                          <span className="font-bold text-red-600">{item.amount.toLocaleString()} тг</span>
                          <button
                            onClick={() => removeTransaction(item.id)}
                            className="text-red-500 hover:text-red-700 text-xl"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Форма добавления расхода */}
                  <AnimatePresence>
                    {showAddExpense && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 p-4 bg-gray-50 rounded-xl"
                      >
                        <form
                          onSubmit={(e) => {
                            e.preventDefault()
                            const formData = new FormData(e.target as HTMLFormElement)
                            const name = formData.get('name') as string
                            const amount = Number(formData.get('amount'))
                            const currentDate = new Date()

                            addTransaction({
                              name,
                              amount,
                              category: 'other',
                              type: 'expense',
                              date: currentDate.toISOString(),
                              month: currentDate.getMonth() + 1,
                              year: currentDate.getFullYear()
                            })
                            setShowAddExpense(false)
                          }}
                          className="space-y-3"
                        >
                          <input
                            type="text"
                            name="name"
                            placeholder="Название расхода"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            required
                          />
                          <input
                            type="number"
                            name="amount"
                            placeholder="Сумма в тенге"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            required
                          />
                          <div className="flex space-x-2">
                            <button
                              type="submit"
                              className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
                            >
                              Добавить
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowAddExpense(false)}
                              className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                            >
                              Отмена
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {/* Аналитика */}
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
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

              {/* Основной блок аналитики - разделение 30/70 */}
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <h2 className="text-2xl font-bold text-finovate-navy mb-8 text-center">Анализ расходов</h2>

                <div className="grid lg:grid-cols-10 gap-8">
                  {/* Левая часть - 30% - Круговая диаграмма */}
                  <div className="lg:col-span-3">
                    <h3 className="text-xl font-bold text-finovate-navy mb-6 text-center">
                      Распределение расходов
                    </h3>

                    {pieChartData.length > 0 ? (
                      <>
                        <PieChart data={pieChartData} total={totalExpense} />

                        {/* Список категорий */}
                        <div className="mt-6 space-y-3">
                          {pieChartData.map((item, index) => {
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
                      </>
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        <p>Нет данных о расходах</p>
                        <p className="text-sm mt-2">Добавьте расходы в разделе "Бюджет"</p>
                      </div>
                    )}
                  </div>

                  {/* Правая часть - 70% - Линейный график */}
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

                    <LineChart historicalData={historicalData} timeframe={timeframe} />
                  </div>
                </div>
              </div>

              {/* Статистика */}
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <h3 className="text-2xl font-bold text-finovate-navy mb-6">Статистика за {period === 'week' ? 'неделю' : period === 'month' ? 'месяц' : 'год'}</h3>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center p-6 bg-blue-50 rounded-2xl">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {currentExpenses.length > 0 ? Math.round(totalExpense / currentExpenses.length).toLocaleString() : 0} тг
                    </div>
                    <div className="text-gray-600">Средний расход</div>
                  </div>
                  <div className="text-center p-6 bg-purple-50 rounded-2xl">
                    <div className="text-2xl font-bold text-purple-600 mb-2">
                      {Object.keys(expensesByCategory).length}
                    </div>
                    <div className="text-gray-600">Категорий трат</div>
                  </div>
                  <div className="text-center p-6 bg-indigo-50 rounded-2xl">
                    <div className="text-2xl font-bold text-indigo-600 mb-2">
                      {totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0}%
                    </div>
                    <div className="text-gray-600">Сбережения</div>
                  </div>
                  <div className="text-center p-6 bg-cyan-50 rounded-2xl">
                    <div className="text-2xl font-bold text-cyan-600 mb-2">
                      {currentExpenses.length > 0 ? Math.max(...currentExpenses.map(item => item.amount)).toLocaleString() : 0} тг
                    </div>
                    <div className="text-gray-600">Крупнейший расход</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Цели */}
          {activeTab === 'goals' && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-finovate-navy">Финансовые цели</h2>
                <button
                  onClick={() => setShowAddGoal(true)}
                  className="bg-finovate-orange text-white px-6 py-3 rounded-xl font-semibold hover:bg-finovate-orange-hover transition-colors flex items-center space-x-2"
                >
                  <PlusIcon />
                  <span>Добавить цель</span>
                </button>
              </div>

              {/* Вкладки для целей */}
              <div className="flex justify-center">
                <div className="bg-white rounded-2xl p-2 flex space-x-2 shadow-lg">
                  <button
                    onClick={() => setGoalsTab('active')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      goalsTab === 'active'
                        ? 'bg-finovate-orange text-white shadow-lg'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Активные ({activeGoals.length})
                  </button>
                  <button
                    onClick={() => setGoalsTab('completed')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      goalsTab === 'completed'
                        ? 'bg-finovate-orange text-white shadow-lg'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Выполненные ({completedGoals.length})
                  </button>
                </div>
              </div>

              {/* Отображение целей в зависимости от выбранной вкладки */}
              <div className="grid lg:grid-cols-2 gap-8">
                {(goalsTab === 'active' ? activeGoals : completedGoals).map((goal) => {
                  const progress = (goal.currentAmount / goal.targetAmount) * 100
                  const monthsLeft = Math.ceil((goal.targetAmount - goal.currentAmount) / goal.monthlyContribution)
                  const isCompleted = progress >= 100

                  return (
                    <div key={goal.id} className="bg-white rounded-3xl shadow-2xl p-8">
                      {editingGoal === goal.id ? (
                        // Форма редактирования
                        <form
                          onSubmit={(e) => {
                            e.preventDefault()
                            const formData = new FormData(e.target as HTMLFormElement)
                            updateGoal(goal.id, {
                              name: formData.get('name') as string,
                              targetAmount: Number(formData.get('targetAmount')),
                              monthlyContribution: Number(formData.get('monthlyContribution')),
                              deadline: formData.get('deadline') as string,
                              initialPayment: Number(formData.get('initialPayment')) || 0
                            })
                            setEditingGoal(null)
                          }}
                          className="space-y-4"
                        >
                          <input
                            type="text"
                            name="name"
                            defaultValue={goal.name}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-finovate-orange focus:border-finovate-orange"
                            required
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <input
                              type="number"
                              name="targetAmount"
                              defaultValue={goal.targetAmount}
                              placeholder="Целевая сумма"
                              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-finovate-orange focus:border-finovate-orange"
                              required
                            />
                            <input
                              type="number"
                              name="monthlyContribution"
                              defaultValue={goal.monthlyContribution}
                              placeholder="Ежемесячный взнос"
                              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-finovate-orange focus:border-finovate-orange"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <input
                              type="date"
                              name="deadline"
                              defaultValue={goal.deadline}
                              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-finovate-orange focus:border-finovate-orange"
                            />
                            <input
                              type="number"
                              name="initialPayment"
                              defaultValue={goal.initialPayment || ''}
                              placeholder="Первоначальный взнос (необязательно)"
                              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-finovate-orange focus:border-finovate-orange"
                            />
                          </div>
                          <div className="flex space-x-4">
                            <button
                              type="submit"
                              className="flex-1 bg-finovate-orange text-white py-2 rounded-xl hover:bg-finovate-orange-hover transition-colors"
                            >
                              Сохранить
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingGoal(null)}
                              className="flex-1 bg-gray-500 text-white py-2 rounded-xl hover:bg-gray-600 transition-colors"
                            >
                              Отмена
                            </button>
                          </div>
                        </form>
                      ) : (
                        // Обычное отображение цели
                        <>
                          <div
                            className="flex items-center space-x-3 mb-6 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors"
                            onClick={() => !isCompleted && setEditingGoal(goal.id)}
                          >
                            <div className={`p-3 rounded-xl ${isCompleted ? 'bg-green-100' : 'bg-finovate-orange-light'}`}>
                              <GoalIcon />
                            </div>
                            <h3 className="text-xl font-bold text-finovate-navy">{goal.name}</h3>
                          </div>

                          <div className="space-y-4">
                            {isCompleted ? (
                              // Для выполненных целей
                              <div className="text-center py-8">
                                <div className="text-2xl font-bold text-green-600 mb-2">
                                  Цель выполнена!
                                </div>
                                <div className="text-gray-600">
                                  Поздравляем с достижением цели!
                                </div>
                              </div>
                            ) : (
                              // Для активных целей
                              <>
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-600">Прогресс</span>
                                  <span className="font-bold text-finovate-navy">{progress.toFixed(1)}%</span>
                                </div>

                                <div className="w-full bg-gray-200 rounded-full h-3">
                                  <div
                                    className="bg-finovate-orange h-3 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min(progress, 100)}%` }}
                                  ></div>
                                </div>
                              </>
                            )}

                            <div className="grid grid-cols-2 gap-4 text-center">
                              <div className="bg-gray-50 p-4 rounded-xl">
                                <div className="text-lg font-bold text-finovate-navy">
                                  {goal.currentAmount.toLocaleString()} тг
                                </div>
                                <div className="text-sm text-gray-600">Накоплено</div>
                              </div>
                              <div className="bg-gray-50 p-4 rounded-xl">
                                <div className="text-lg font-bold text-finovate-navy">
                                  {goal.targetAmount.toLocaleString()} тг
                                </div>
                                <div className="text-sm text-gray-600">Цель</div>
                              </div>
                            </div>

                            {!isCompleted && (
                              <>
                                <div className="bg-finovate-orange-light p-4 rounded-xl">
                                  <div className="flex justify-between items-center">
                                    <span className="text-finovate-navy font-medium">Ежемесячно:</span>
                                    <span className="font-bold text-finovate-orange">{goal.monthlyContribution.toLocaleString()} тг</span>
                                  </div>
                                  <div className="flex justify-between items-center mt-2">
                                    <span className="text-finovate-navy font-medium">Осталось месяцев:</span>
                                    <span className="font-bold text-finovate-orange">{monthsLeft}</span>
                                  </div>
                                  {goal.initialPayment && (
                                    <div className="flex justify-between items-center mt-2">
                                      <span className="text-finovate-navy font-medium">Первоначальный взнос:</span>
                                      <span className="font-bold text-finovate-orange">{goal.initialPayment.toLocaleString()} тг</span>
                                    </div>
                                  )}
                                </div>

                                {/* Кнопки пополнения */}
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => addToGoal(goal.id, goal.monthlyContribution)}
                                    className="flex-1 bg-green-500 text-white py-2 rounded-xl hover:bg-green-600 transition-colors"
                                  >
                                    Пополнить
                                  </button>
                                  <button
                                    onClick={() => setShowCustomInput(goal.id)}
                                    className="flex-1 bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition-colors"
                                  >
                                    Другая сумма
                                  </button>
                                </div>

                                {/* Поле для ввода другой суммы */}
                                <AnimatePresence>
                                  {showCustomInput === goal.id && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      className="flex space-x-2"
                                    >
                                      <input
                                        type="number"
                                        value={customAmount}
                                        onChange={(e) => setCustomAmount(e.target.value)}
                                        placeholder="Введите сумму"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-finovate-orange focus:border-finovate-orange"
                                      />
                                      <button
                                        onClick={() => handleCustomContribution(goal.id)}
                                        className="bg-finovate-orange text-white px-4 py-2 rounded-xl hover:bg-finovate-orange-hover transition-colors"
                                      >
                                        Добавить
                                      </button>
                                      <button
                                        onClick={() => setShowCustomInput(null)}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition-colors"
                                      >
                                        ×
                                      </button>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Форма добавления цели */}
              <AnimatePresence>
                {showAddGoal && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white rounded-3xl shadow-2xl p-8"
                  >
                    <h3 className="text-2xl font-bold text-finovate-navy mb-6">Добавить новую цель</h3>
                    <form onSubmit={handleGoalSubmit} className="grid md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <input
                          type="text"
                          value={goalForm.name}
                          onChange={(e) => handleGoalFormChange('name', e.target.value)}
                          placeholder="Название цели (например: Первоначальный взнос на квартиру)"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-finovate-orange focus:border-finovate-orange"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={goalForm.targetAmount}
                          onChange={(e) => handleGoalFormChange('targetAmount', e.target.value)}
                          placeholder="Целевая сумма (тг) *"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-finovate-orange focus:border-finovate-orange"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={goalForm.initialPayment}
                          onChange={(e) => handleGoalFormChange('initialPayment', e.target.value)}
                          placeholder="Первоначальный взнос (тг) - необязательно"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-finovate-orange focus:border-finovate-orange"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={goalForm.monthlyContribution}
                          onChange={(e) => handleGoalFormChange('monthlyContribution', e.target.value)}
                          placeholder="Ежемесячный взнос (тг) - рассчитается автоматически"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-finovate-orange focus:border-finovate-orange"
                        />
                      </div>
                      <div>
                        <input
                          type="date"
                          value={goalForm.deadline}
                          onChange={(e) => handleGoalFormChange('deadline', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-finovate-orange focus:border-finovate-orange"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600 mb-4">
                          * Заполните либо ежемесячный взнос, либо дату дедлайна - второе поле рассчитается автоматически
                        </p>
                      </div>
                      <div className="md:col-span-2 flex space-x-4">
                        <button
                          type="submit"
                          className="flex-1 bg-finovate-orange text-white py-3 rounded-xl font-semibold hover:bg-finovate-orange-hover transition-colors"
                        >
                          Добавить цель
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddGoal(false)
                            setGoalForm({
                              name: '',
                              targetAmount: '',
                              monthlyContribution: '',
                              deadline: '',
                              initialPayment: ''
                            })
                          }}
                          className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                        >
                          Отмена
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}