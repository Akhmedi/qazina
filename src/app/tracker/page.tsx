
'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Интерфейсы
interface Transaction {
  id: string
  name: string
  amount: number
  category: string
  type: 'income' | 'expense'
  date: string
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

// Заглушка для линейного графика
const LineChart = ({ period }: { period: string }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-200">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-bold text-finovate-navy">Динамика трат</h3>
      <div className="flex space-x-2">
        <span className="px-3 py-1 bg-finovate-orange text-white rounded-lg text-sm">{period}</span>
      </div>
    </div>
    <div className="bg-gray-50 rounded-xl h-64 flex items-center justify-center">
      <div className="text-center text-gray-500">
        <ChartIcon />
        <p className="mt-2">График изменения трат</p>
        <p className="text-sm">Период: {period}</p>
      </div>
    </div>
  </div>
)

export default function TrackerPage() {
  const [activeTab, setActiveTab] = useState<'budget' | 'analytics' | 'goals'>('budget')
  const [goalsTab, setGoalsTab] = useState<'active' | 'completed'>('active')
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month')
  const [showAddIncome, setShowAddIncome] = useState(false)
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [showAddGoal, setShowAddGoal] = useState(false)
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

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Состояния для доходов и расходов
  const [incomeItems, setIncomeItems] = useState([
    { id: '1', name: 'Зарплата', amount: 500000, category: 'salary' }
  ])

  const [expenseItems, setExpenseItems] = useState([
    { id: '1', name: 'Коммунальные услуги', amount: 45000, category: 'utilities' },
    { id: '2', name: 'Мобильная связь', amount: 8000, category: 'telecom' },
    { id: '3', name: 'Еда и напитки', amount: 120000, category: 'food' }
  ])

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      name: 'Первоначальный взнос на квартиру',
      targetAmount: 5000000,
      currentAmount: 5000000, // 100% для демонстрации
      monthlyContribution: 150000,
      deadline: '2025-12-31',
      initialPayment: 200000
    },
    {
      id: '2',
      name: 'Отпуск в Европе',
      targetAmount: 800000,
      currentAmount: 400000, // 50% для демонстрации
      monthlyContribution: 80000,
      deadline: '2025-06-30'
    }
  ])

  // Вычисления
  const totalIncome = incomeItems.reduce((sum, item) => sum + item.amount, 0)
  const totalExpense = expenseItems.reduce((sum, item) => sum + item.amount, 0)
  const balance = totalIncome - totalExpense

  // Фильтрация целей
  const activeGoals = goals.filter(goal => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100
    return progress < 100
  })

  const completedGoals = goals.filter(goal => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100
    return progress >= 100
  })

  // Данные для круговой диаграммы расходов
  const expenseChartData = expenseItems.map((item, index) => ({
    name: item.name,
    value: item.amount,
    color: ['#F28B30', '#5A6CF5', '#10B981', '#F59E0B', '#EF4444'][index % 5]
  }))

  // Функции для расчета автоматических значений
  const calculateMissingValue = () => {
    const target = parseFloat(goalForm.targetAmount)
    const initial = parseFloat(goalForm.initialPayment) || 0
    const remaining = target - initial

    if (goalForm.monthlyContribution && !goalForm.deadline) {
      // Рассчитать дедлайн по ежемесячному взносу
      const months = Math.ceil(remaining / parseFloat(goalForm.monthlyContribution))
      const calculatedDeadline = new Date()
      calculatedDeadline.setMonth(calculatedDeadline.getMonth() + months)
      setGoalForm({
        ...goalForm,
        deadline: calculatedDeadline.toISOString().split('T')[0]
      })
    } else if (goalForm.deadline && !goalForm.monthlyContribution) {
      // Рассчитать ежемесячный взнос по дедлайну
      const deadlineDate = new Date(goalForm.deadline)
      const now = new Date()
      const months = Math.max(1, Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)))
      setGoalForm({
        ...goalForm,
        monthlyContribution: (remaining / months).toFixed(2)
      })
    }
  }

  // Функции для добавления элементов
  const addIncomeItem = (name: string, amount: number) => {
    setIncomeItems([...incomeItems, {
      id: Date.now().toString(),
      name,
      amount,
      category: 'other'
    }])
  }

  const addExpenseItem = (name: string, amount: number) => {
    setExpenseItems([...expenseItems, {
      id: Date.now().toString(),
      name,
      amount,
      category: 'other'
    }])
  }

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

  const removeItem = (id: string, type: 'income' | 'expense') => {
    if (type === 'income') {
      setIncomeItems(incomeItems.filter(item => item.id !== id))
    } else {
      setExpenseItems(expenseItems.filter(item => item.id !== id))
    }
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

  // Обработка изменений в форме цели
  const handleGoalFormChange = (field: string, value: string) => {
    const newForm = { ...goalForm, [field]: value }
    setGoalForm(newForm)

    // Автоматический расчет при изменении ключевых полей
    if (field === 'monthlyContribution' || field === 'deadline' || field === 'targetAmount' || field === 'initialPayment') {
      setTimeout(() => calculateMissingValue(), 100)
    }
  }

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Проверка обязательных полей
    if (!goalForm.name || !goalForm.targetAmount) {
      alert('Пожалуйста, заполните название цели и целевую сумму')
      return
    }

    // Проверка что хотя бы одно из полей (ежемесячный взнос или дедлайн) заполнено
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

    // Сброс формы
    setGoalForm({
      name: '',
      targetAmount: '',
      monthlyContribution: '',
      deadline: '',
      initialPayment: ''
    })
    setShowAddGoal(false)
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
                    {incomeItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                        <span className="font-medium text-gray-700">{item.name}</span>
                        <div className="flex items-center space-x-3">
                          <span className="font-bold text-green-600">{item.amount.toLocaleString()} тг</span>
                          <button
                            onClick={() => removeItem(item.id, 'income')}
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
                            addIncomeItem(name, amount)
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
                    {expenseItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                        <span className="font-medium text-gray-700">{item.name}</span>
                        <div className="flex items-center space-x-3">
                          <span className="font-bold text-red-600">{item.amount.toLocaleString()} тг</span>
                          <button
                            onClick={() => removeItem(item.id, 'expense')}
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
                            addExpenseItem(name, amount)
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

              <div className="grid lg:grid-cols-1 gap-8">
                <LineChart period={period === 'week' ? 'Неделя' : period === 'month' ? 'Месяц' : 'Год'} />
              </div>

              {/* Статистика */}
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <h3 className="text-2xl font-bold text-finovate-navy mb-6">Статистика за {period === 'week' ? 'неделю' : period === 'month' ? 'месяц' : 'год'}</h3>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center p-6 bg-blue-50 rounded-2xl">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {Math.round(totalExpense / expenseItems.length).toLocaleString()} тг
                    </div>
                    <div className="text-gray-600">Средний расход</div>
                  </div>
                  <div className="text-center p-6 bg-purple-50 rounded-2xl">
                    <div className="text-2xl font-bold text-purple-600 mb-2">
                      {expenseItems.length}
                    </div>
                    <div className="text-gray-600">Категорий трат</div>
                  </div>
                  <div className="text-center p-6 bg-indigo-50 rounded-2xl">
                    <div className="text-2xl font-bold text-indigo-600 mb-2">
                      {((balance / totalIncome) * 100).toFixed(1)}%
                    </div>
                    <div className="text-gray-600">Сбережения</div>
                  </div>
                  <div className="text-center p-6 bg-cyan-50 rounded-2xl">
                    <div className="text-2xl font-bold text-cyan-600 mb-2">
                      {Math.max(...expenseItems.map(item => item.amount)).toLocaleString()} тг
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
                                {/*<div className="text-6xl mb-4">🎉</div>*/}
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