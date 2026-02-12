'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGoals } from '@/hooks/useGoals'
import { useSaveStatus } from '@/hooks/useSaveStatus'

const GoalIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
)

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
)

export default function GoalsPage() {
  const [goalsTab, setGoalsTab] = useState<'active' | 'completed'>('active')
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [editingGoal, setEditingGoal] = useState<string | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [showCustomInput, setShowCustomInput] = useState<string | null>(null)

  const {
    activeGoals,
    completedGoals,
    addGoal,
    updateGoal,
    deleteGoal,
    addToGoal
  } = useGoals()

  const { setSaving, setSaved } = useSaveStatus()

  // Форма создания цели
  const [goalForm, setGoalForm] = useState({
    name: '',
    targetAmount: '',
    monthlyContribution: '',
    deadline: '',
    initialPayment: ''
  })

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

    setSaving()

    addGoal({
      name: goalForm.name,
      targetAmount: Number(goalForm.targetAmount),
      currentAmount: Number(goalForm.initialPayment) || 0,
      monthlyContribution: Number(goalForm.monthlyContribution),
      deadline: goalForm.deadline,
      initialPayment: Number(goalForm.initialPayment) || undefined,
      type: 'manual'
    })

    setGoalForm({
      name: '',
      targetAmount: '',
      monthlyContribution: '',
      deadline: '',
      initialPayment: ''
    })
    setShowAddGoal(false)
    setSaved()
  }

  const handleCustomContribution = (goalId: string) => {
    const amount = Number(customAmount)
    if (amount > 0) {
      setSaving()
      addToGoal(goalId, amount)
      setCustomAmount('')
      setShowCustomInput(null)
      setSaved()
    }
  }

  const handleAddToGoal = (goalId: string, amount: number) => {
    setSaving()
    addToGoal(goalId, amount)
    setSaved()
  }

  const handleUpdateGoal = (goalId: string, updates: any) => {
    setSaving()
    updateGoal(goalId, updates)
    setEditingGoal(null)
    setSaved()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
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
                    handleUpdateGoal(goal.id, {
                      name: formData.get('name') as string,
                      targetAmount: Number(formData.get('targetAmount')),
                      monthlyContribution: Number(formData.get('monthlyContribution')),
                      deadline: formData.get('deadline') as string,
                      initialPayment: Number(formData.get('initialPayment')) || 0
                    })
                  }}
                  className="space-y-4"
                >
                  <input
                    type="text"
                    name="name"
                    defaultValue={goal.name}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-finovate-orange focus:border-finovate-orange"
                    required
                    disabled={goal.type === 'loan'}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      name="targetAmount"
                      defaultValue={goal.targetAmount}
                      placeholder="Целевая сумма"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-finovate-orange focus:border-finovate-orange"
                      required
                      disabled={goal.type === 'loan'}
                    />
                    <input
                      type="number"
                      name="monthlyContribution"
                      defaultValue={goal.monthlyContribution}
                      placeholder="Ежемесячный взнос"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-finovate-orange focus:border-finovate-orange"
                      disabled={goal.type === 'loan'}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="date"
                      name="deadline"
                      defaultValue={goal.deadline}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-finovate-orange focus:border-finovate-orange"
                      disabled={goal.type === 'loan'}
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
                    className={`flex items-center space-x-3 mb-6 ${goal.type !== 'loan' ? 'cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors' : ''}`}
                    onClick={() => !isCompleted && goal.type !== 'loan' && setEditingGoal(goal.id)}
                  >
                    <div className={`p-3 rounded-xl ${isCompleted ? 'bg-green-100' : 'bg-finovate-orange-light'}`}>
                      <GoalIcon />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-finovate-navy">{goal.name}</h3>
                      {goal.type === 'loan' && (
                        <div className="text-sm text-finovate-orange font-medium">
                          Кредитная цель
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {isCompleted ? (
                      <div className="text-center py-8">
                        <div className="text-2xl font-bold text-green-600 mb-2">
                          Цель выполнена!
                        </div>
                        <div className="text-gray-600">
                          Поздравляем с достижением цели!
                        </div>
                      </div>
                    ) : (
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
                            onClick={() => handleAddToGoal(goal.id, goal.monthlyContribution)}
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
  )
}