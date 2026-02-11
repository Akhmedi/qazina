
'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'

// Типы данных
export interface User {
  id: string
  name: string
  email: string
  phone?: string
  dateJoined: string
}

export interface Position {
  id: string
  symbol: string
  name: string
  type: 'stock' | 'bond' | 'etf'
  sector?: string
  bondType?: string
  etfType?: string
  quantity: number
  avgPrice: number
  currentPrice: number
  marketValue: number
  pnl: number
  pnlPercent: number
}

export interface Transaction {
  id: string
  type: 'buy' | 'sell'
  symbol: string
  name: string
  quantity: number
  price: number
  amount: number
  date: string
  fees: number
}

export interface PortfolioState {
  totalValue: number
  totalPnl: number
  totalPnlPercent: number
  cash: number
  positions: Position[]
  transactions: Transaction[]
  lastTopUp: string | null
}

export interface AppState {
  isAuthenticated: boolean
  user: User | null
  portfolio: PortfolioState
  settings: {
    currency: 'USD' | 'KZT'
    language: 'ru' | 'en'
  }
}

// Начальное состояние
const initialState: AppState = {
  isAuthenticated: false,
  user: null,
  portfolio: {
    totalValue: 3000,
    totalPnl: 0,
    totalPnlPercent: 0,
    cash: 3000,
    positions: [],
    transactions: [],
    lastTopUp: null
  },
  settings: {
    currency: 'USD',
    language: 'ru'
  }
}

// Мок-данные для демо-портфеля
const mockPositions: Position[] = [
  {
    id: '1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    type: 'stock',
    sector: 'Technology',
    quantity: 10,
    avgPrice: 150,
    currentPrice: 175,
    marketValue: 1750,
    pnl: 250,
    pnlPercent: 16.67
  },
  {
    id: '2',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    type: 'stock',
    sector: 'Technology',
    quantity: 5,
    avgPrice: 300,
    currentPrice: 320,
    marketValue: 1600,
    pnl: 100,
    pnlPercent: 6.67
  },
  {
    id: '3',
    symbol: 'US10Y',
    name: 'US Treasury 10Y',
    type: 'bond',
    bondType: 'Government',
    quantity: 20,
    avgPrice: 95,
    currentPrice: 98,
    marketValue: 1960,
    pnl: 60,
    pnlPercent: 3.16
  },
  {
    id: '4',
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF',
    type: 'etf',
    etfType: 'Index',
    quantity: 8,
    avgPrice: 400,
    currentPrice: 420,
    marketValue: 3360,
    pnl: 160,
    pnlPercent: 5.00
  }
]

// Действия
type Action =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'RESET_PORTFOLIO' }
  | { type: 'TOP_UP_BALANCE'; payload: number }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppState['settings']> }
  | { type: 'LOAD_FROM_STORAGE'; payload: AppState }

// Редьюсер
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload
      }
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null
      }
    case 'RESET_PORTFOLIO':
      const newPortfolio: PortfolioState = {
        totalValue: 3000,
        totalPnl: 0,
        totalPnlPercent: 0,
        cash: 500,
        positions: mockPositions,
        transactions: [],
        lastTopUp: new Date().toISOString()
      }
      return {
        ...state,
        portfolio: newPortfolio
      }
    case 'TOP_UP_BALANCE':
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          cash: state.portfolio.cash + action.payload,
          totalValue: state.portfolio.totalValue + action.payload,
          lastTopUp: new Date().toISOString()
        }
      }
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      }
    case 'LOAD_FROM_STORAGE':
      return action.payload
    default:
      return state
  }
}

// Context
const ProfileContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<Action>
}>({ state: initialState, dispatch: () => {} })

// Провайдер
export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Загрузка из localStorage при инициализации
  useEffect(() => {
    const saved = localStorage.getItem('qazinv-profile')
    if (saved) {
      try {
        const parsedState = JSON.parse(saved)
        dispatch({ type: 'LOAD_FROM_STORAGE', payload: parsedState })
      } catch (e) {
        console.error('Error loading state from localStorage:', e)
      }
    }
  }, [])

  // Сохранение в localStorage при изменении состояния
  useEffect(() => {
    localStorage.setItem('qazinv-profile', JSON.stringify(state))
  }, [state])

  // Weekly top-up логика
  useEffect(() => {
    if (state.isAuthenticated && state.portfolio.lastTopUp) {
      const lastTopUp = new Date(state.portfolio.lastTopUp)
      const now = new Date()
      const daysDiff = Math.floor((now.getTime() - lastTopUp.getTime()) / (1000 * 60 * 60 * 24))

      // Если прошло больше 7 дней и баланс меньше 1000 USD
      if (daysDiff >= 7 && state.portfolio.cash < 1000) {
        const topUpAmount = Math.max(1000 - state.portfolio.cash, 500)
        dispatch({ type: 'TOP_UP_BALANCE', payload: topUpAmount })
      }
    }
  }, [state.isAuthenticated, state.portfolio.lastTopUp, state.portfolio.cash])

  return (
    <ProfileContext.Provider value={{ state, dispatch }}>
      {children}
    </ProfileContext.Provider>
  )
}

// Хук для использования контекста
export const useProfile = () => {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider')
  }
  return context
}