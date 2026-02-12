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
  month: number
  year: number
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

export default function BudgetPage() {
  const [showAddIncome, setShowAddIncome] = useState(false)
  const [showAddExpense, setShowAddExpense] = useState(false)
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

  // Вычисления для текущего периода
  const currentIncomes = transactions.filter(t => t.type === 'income')
  const currentExpenses = transactions.filter(t => t.type === 'expense')
  const totalIncome = currentIncomes.reduce((sum, item) => sum + item.amount, 0)
  const totalExpense = currentExpenses.reduce((sum, item) => sum + item.amount, 0)
  const balance = totalIncome - totalExpense

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

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const processFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      alert(`Файл ${file.name} загружен! (функция обработки будет добавлена позже)`)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
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

      {/* Файл загрузки */}
      <div className="bg-white rounded-3xl shadow-2xl p-8">
        <h3 className="text-2xl font-bold text-finovate-navy mb-6">Загрузка файлов</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-finovate-orange transition-colors">
          <button
            onClick={handleFileUpload}
            className="flex flex-col items-center space-y-4 text-gray-600 hover:text-finovate-orange transition-colors"
          >
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <div>
              <p className="text-lg font-semibold">Загрузить банковскую выписку</p>
              <p className="text-sm">CSV, XLS или PDF файлы</p>
            </div>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={processFile}
            className="hidden"
            accept=".csv,.xls,.xlsx,.pdf"
          />
        </div>
      </div>
    </motion.div>
  )
}