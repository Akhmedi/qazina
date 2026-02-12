
export interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  monthlyContribution: number
  deadline: string
  initialPayment?: number
  type?: 'manual' | 'loan'
  loanParams?: {
    method: 'annuity' | 'differentiated'
    principal: number
    rate: number
    termYears: number
  }
}

const STORAGE_KEY = 'qazina_goals'

// Безопасное получение данных из localStorage
const getStoredGoals = (): Goal[] => {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []

    const goals = JSON.parse(stored) as Goal[]
    // Валидация структуры данных
    return goals.filter(goal =>
      goal.id &&
      goal.name &&
      typeof goal.targetAmount === 'number' &&
      typeof goal.currentAmount === 'number' &&
      typeof goal.monthlyContribution === 'number' &&
      goal.deadline
    )
  } catch (error) {
    console.error('Error loading goals from localStorage:', error)
    return []
  }
}

// Сохранение в localStorage
const saveGoals = (goals: Goal[]): void => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals))
  } catch (error) {
    console.error('Error saving goals to localStorage:', error)
  }
}

// Генерация уникального ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// API для работы с целями
export const goalsAPI = {
  // Получить все цели
  getAll: (): Goal[] => {
    return getStoredGoals()
  },

  // Добавить новую цель
  add: (goal: Omit<Goal, 'id'>): Goal => {
    const goals = getStoredGoals()
    const newGoal: Goal = {
      ...goal,
      id: generateId()
    }

    goals.push(newGoal)
    saveGoals(goals)

    return newGoal
  },

  // Обновить цель
  update: (id: string, updates: Partial<Goal>): Goal | null => {
    const goals = getStoredGoals()
    const index = goals.findIndex(g => g.id === id)

    if (index === -1) return null

    goals[index] = { ...goals[index], ...updates }
    saveGoals(goals)

    return goals[index]
  },

  // Удалить цель
  delete: (id: string): boolean => {
    const goals = getStoredGoals()
    const filtered = goals.filter(g => g.id !== id)

    if (filtered.length === goals.length) return false

    saveGoals(filtered)
    return true
  },

  // Проверить существование похожей цели кредита
  findSimilarLoanGoal: (loanParams: {
    method: 'annuity' | 'differentiated'
    principal: number
    rate: number
    termYears: number
  }): Goal | null => {
    const goals = getStoredGoals()
    return goals.find(goal =>
      goal.type === 'loan' &&
      goal.loanParams &&
      goal.loanParams.method === loanParams.method &&
      goal.loanParams.principal === loanParams.principal &&
      goal.loanParams.rate === loanParams.rate &&
      goal.loanParams.termYears === loanParams.termYears
    ) || null
  },

  // Добавить цель кредита (с проверкой дубликатов)
  addLoanGoal: (
    method: 'annuity' | 'differentiated',
    principal: number,
    rate: number,
    termYears: number
  ): { goal: Goal, isNew: boolean } => {
    const loanParams = { method, principal, rate, termYears }
    const existing = goalsAPI.findSimilarLoanGoal(loanParams)

    if (existing) {
      // Обновляем существующую цель
      const updated = goalsAPI.update(existing.id, {
        ...calculateLoanGoalParams(method, principal, rate, termYears),
        loanParams
      })
      return { goal: updated!, isNew: false }
    }

    // Создаем новую цель
    const goalParams = calculateLoanGoalParams(method, principal, rate, termYears)
    const newGoal = goalsAPI.add({
      ...goalParams,
      type: 'loan',
      loanParams
    })

    return { goal: newGoal, isNew: true }
  }
}

// Расчет параметров цели для кредита
const calculateLoanGoalParams = (
  method: 'annuity' | 'differentiated',
  principal: number,
  rate: number,
  termYears: number
) => {
  const monthlyRate = rate / 100 / 12
  const months = termYears * 12

  let monthlyPayment: number
  let totalAmount: number

  if (method === 'annuity') {
    monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
    totalAmount = monthlyPayment * months
  } else {
    // Дифференцированный - используем средний платеж
    const principalPayment = principal / months
    let totalInterest = 0

    for (let i = 0; i < months; i++) {
      const remainingBalance = principal - (principalPayment * i)
      totalInterest += remainingBalance * monthlyRate
    }

    totalAmount = principal + totalInterest
    monthlyPayment = totalAmount / months // Средний платеж
  }

  // Вычисляем дату окончания кредита
  const endDate = new Date()
  endDate.setFullYear(endDate.getFullYear() + termYears)

  return {
    name: `Погашение кредита: ${method === 'annuity' ? 'аннуитет' : 'дифференцированный'}, ${termYears} ${termYears === 1 ? 'год' : termYears < 5 ? 'года' : 'лет'}`,
    targetAmount: Math.round(totalAmount),
    currentAmount: 0,
    monthlyContribution: Math.round(monthlyPayment),
    deadline: endDate.toISOString().split('T')[0]
  }
}