'use client'

// Единый модуль управления целями
export interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  monthlyContribution: number
  deadline: string
  initialPayment?: number
  type: 'manual' | 'loan'
  createdAt: string
  updatedAt: string
}

class GoalsManager {
  private readonly STORAGE_KEY = 'qazinv_goals'
  private goals: Goal[] = []
  private listeners: Set<() => void> = new Set()

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadFromStorage()
    }
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        this.goals = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load goals from storage:', error)
      this.goals = []
    }
  }

  private saveToStorage() {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.goals))
        this.notifyListeners()
      }
    } catch (error) {
      console.error('Failed to save goals to storage:', error)
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener())
  }

  // Подписка на изменения
  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  // Получить все цели
  getAll(): Goal[] {
    return [...this.goals]
  }

  // Получить цель по ID
  getById(id: string): Goal | undefined {
    return this.goals.find(goal => goal.id === id)
  }

  // Добавить цель
  add(goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): Goal {
    const now = new Date().toISOString()
    const goal: Goal = {
      ...goalData,
      id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now
    }

    this.goals.push(goal)
    this.saveToStorage()
    return goal
  }

  // Обновить цель
  update(id: string, updates: Partial<Omit<Goal, 'id' | 'createdAt'>>): Goal | null {
    const index = this.goals.findIndex(goal => goal.id === id)
    if (index === -1) return null

    const updatedGoal = {
      ...this.goals[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    this.goals[index] = updatedGoal
    this.saveToStorage()
    return updatedGoal
  }

  // Удалить цель
  delete(id: string): boolean {
    const index = this.goals.findIndex(goal => goal.id === id)
    if (index === -1) return false

    this.goals.splice(index, 1)
    this.saveToStorage()
    return true
  }

  // Добавить средства к цели
  addAmount(id: string, amount: number): Goal | null {
    const goal = this.getById(id)
    if (!goal) return null

    const newAmount = Math.min(goal.currentAmount + amount, goal.targetAmount)
    return this.update(id, { currentAmount: newAmount })
  }

  // Получить активные цели
  getActive(): Goal[] {
    return this.goals.filter(goal => {
      const progress = (goal.currentAmount / goal.targetAmount) * 100
      return progress < 100
    })
  }

  // Получить выполненные цели
  getCompleted(): Goal[] {
    return this.goals.filter(goal => {
      const progress = (goal.currentAmount / goal.targetAmount) * 100
      return progress >= 100
    })
  }
}

// Экспортируем единственный экземпляр
export const goalsManager = new GoalsManager()

// Для совместимости с существующим кодом
export const goalsAPI = {
  getAll: () => goalsManager.getAll(),
  add: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => goalsManager.add(goal),
  update: (id: string, updates: Partial<Goal>) => goalsManager.update(id, updates),
  delete: (id: string) => goalsManager.delete(id),
  addAmount: (id: string, amount: number) => goalsManager.addAmount(id, amount)
}