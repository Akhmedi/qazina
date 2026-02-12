'use client'

import { useState, useEffect } from 'react'
import { goalsManager, Goal } from '@/lib/goals'

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Загружаем цели
    setGoals(goalsManager.getAll())
    setIsLoading(false)

    // Подписываемся на изменения
    const unsubscribe = goalsManager.subscribe(() => {
      setGoals(goalsManager.getAll())
    })

    return unsubscribe
  }, [])

  return {
    goals,
    isLoading,
    activeGoals: goals.filter(goal => (goal.currentAmount / goal.targetAmount) * 100 < 100),
    completedGoals: goals.filter(goal => (goal.currentAmount / goal.targetAmount) * 100 >= 100),
    addGoal: (goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => goalsManager.add(goalData),
    updateGoal: (id: string, updates: Partial<Goal>) => goalsManager.update(id, updates),
    deleteGoal: (id: string) => goalsManager.delete(id),
    addToGoal: (id: string, amount: number) => goalsManager.addAmount(id, amount)
  }
}