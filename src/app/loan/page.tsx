'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { goalsAPI } from '@/lib/goals'

// Интерфейсы для типизации
interface LoanCalculation {
  monthlyPayment: number
  totalOverpay: number
  totalAmount: number
  schedule?: PaymentScheduleItem[]
}

interface PaymentScheduleItem {
  month: number
  payment: number
  principal: number
  interest: number
  balance: number
}

interface AdvancedCalculation {
  purpose: string
  reason: string
  income: number
  expenses: string
  inflation: number
}

interface NewsItem {
  id: number
  title: string
  description: string
  image: string
  link: string
  source: string
}

// Интерфейс для состояния кнопки "В цели"
interface AddToGoalsButtonState {
  status: 'disabled' | 'enabled' | 'success'
  text: string
}

// Исправленный компонент для анимации появления элементов при скролле
const ScrollRevealWrapper = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [elementId] = useState(`reveal-${Math.random()}`) // Создаем ID один раз

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById(elementId) // Используем стабильный ID
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [delay, elementId]) // Добавляем elementId в зависимости

  return (
    <motion.div
      id={elementId} // Используем тот же ID
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

// Компонент таба-переключателя
const LoanTypeToggle = ({
  isTargeted,
  onChange
}: {
  isTargeted: boolean
  onChange: (isTargeted: boolean) => void
}) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="relative bg-gray-100 rounded-full p-1 flex">
        <motion.div
          className="absolute top-1 bottom-1 bg-white rounded-full shadow-md"
          initial={false}
          animate={{
            left: isTargeted ? '50%' : '4px',
            right: isTargeted ? '4px' : '50%',
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />

        <button
          onClick={() => onChange(false)}
          className={`relative z-10 px-6 py-3 rounded-full font-semibold transition-colors duration-200 ${
            !isTargeted 
              ? 'text-finovate-orange' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Не целевой
        </button>

        <button
          onClick={() => onChange(true)}
          className={`relative z-10 px-6 py-3 rounded-full font-semibold transition-colors duration-200 ${
            isTargeted 
              ? 'text-finovate-orange' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Целевой
        </button>
      </div>
    </div>
  )
}

// Компонент блока советов
const TipsBlock = () => {
  const tips = [
    "В дифференцированном кредите, платежи в начале высокие, и во времени уменьшается, что делает переплату меньше чем при аннуитетном платеже.",
    "При аннуитетном платеже, платежи равные, что делает кредит упрощенным и удобным.",
    "Чем больше срок, тем больше переплата.",
    "Чем меньше срок, тем меньше ставка, и наоборот, из-за риска.",
    "ГЭСВ - Реальная стоимость кредита с учётом всех комиссий, страховки, и т.д.",
    "Бывают штрафы не только за позднее платеж, но и за досрочное погашение.",
    "Первоначальный взнос играет важную роль, имея минимальный порог, и уменьшая ежемесячный платеж и срок."
  ]

  return (
    <motion.div
      className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 h-full"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-finovate-orange rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="text-3xl font-bold text-finovate-navy">Советы</h3>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {tips.map((tip, index) => (
          <motion.div
            key={index}
            className="bg-finovate-gray rounded-xl p-4 border-l-4 border-finovate-orange"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-finovate-orange rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">{index + 1}</span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{tip}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// Компонент кнопки "В цели"
const AddToGoalsButton = ({
  calculationType,
  amount,
  rate,
  term,
  calculation,
  onAddToGoals
}: {
  calculationType: 'differentiated' | 'annuity'
  amount: string
  rate: string
  term: string
  calculation: LoanCalculation | null
  onAddToGoals: () => void
}) => {
  const [buttonState, setButtonState] = useState<AddToGoalsButtonState>({
    status: 'disabled',
    text: 'В цели'
  })

  // Проверка валидности полей
  const isValid = calculation !== null &&
    parseFloat(amount) > 0 &&
    parseFloat(rate) > 0 &&
    parseFloat(term) > 0

  // Обновляем состояние кнопки при изменении валидности или расчетов
  useEffect(() => {
    if (!isValid) {
      setButtonState({ status: 'disabled', text: 'В цели' })
    } else {
      // Сбрасываем на "enabled" при новом валидном расчете
      setButtonState({ status: 'enabled', text: 'В цели' })
    }
  }, [isValid, calculation])

  const handleClick = () => {
    if (buttonState.status === 'enabled' && isValid) {
      onAddToGoals()

      // Показываем успешное состояние
      setButtonState({ status: 'success', text: 'Добавлено' })

      // Сбрасываем состояние через 2 секунды
      setTimeout(() => {
        setButtonState({ status: 'enabled', text: 'В цели' })
      }, 2000)
    }
  }

  const getButtonStyles = () => {
    switch (buttonState.status) {
      case 'disabled':
        return 'bg-gray-300 text-gray-500 cursor-not-allowed'
      case 'success':
        return 'bg-green-500 text-white'
      case 'enabled':
      default:
        return 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'
    }
  }

  return (
    <motion.button
      onClick={handleClick}
      disabled={buttonState.status === 'disabled'}
      className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 ${getButtonStyles()}`}
      whileHover={buttonState.status === 'enabled' ? { scale: 1.05 } : {}}
      whileTap={buttonState.status === 'enabled' ? { scale: 0.95 } : {}}
      initial={false}
      animate={{
        backgroundColor: buttonState.status === 'success' ? '#10B981' : undefined
      }}
    >
      {buttonState.status === 'success' && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-block mr-1 bg-white text-green-500 rounded-full w-5 h-5 flex items-center justify-center text-xs"
        >
          ✓
        </motion.span>
      )}
      {buttonState.text}
    </motion.button>
  )
}

// Компонент калькулятора
const LoanCalculator = ({
  title,
  isTargeted = false,
  showToggleButton = false,
  showSecondCalculator,
  onToggle
}: {
  title: string
  isTargeted?: boolean
  showToggleButton?: boolean
  showSecondCalculator?: boolean
  onToggle?: () => void
}) => {
  const [calculationType, setCalculationType] = useState<'differentiated' | 'annuity'>('annuity')
  const [amount, setAmount] = useState<string>('')
  const [rate, setRate] = useState<string>('')
  const [term, setTerm] = useState<string>('')
  const [calculation, setCalculation] = useState<LoanCalculation | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Advanced fields
  const [advanced, setAdvanced] = useState<AdvancedCalculation>({
    purpose: '',
    reason: '',
    income: 0,
    expenses: '',
    inflation: 12
  })
  const [aiResponse, setAiResponse] = useState<string>('')

  // Дополнительное поле для целевого кредита
  const [subjectType, setSubjectType] = useState<string>('')

  const calculateLoan = () => {
    const loanAmount = parseFloat(amount)
    const monthlyRate = parseFloat(rate) / 100 / 12
    const months = parseFloat(term) * 12

    if (!loanAmount || !monthlyRate || !months) return

    let monthlyPayment: number
    let totalAmount: number

    if (calculationType === 'annuity') {
      monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
      totalAmount = monthlyPayment * months
    } else {
      // Дифференцированный
      const principalPayment = loanAmount / months
      const firstPayment = principalPayment + (loanAmount * monthlyRate)
      monthlyPayment = firstPayment // Показываем первый платеж

      let totalInterest = 0
      for (let i = 0; i < months; i++) {
        const remainingBalance = loanAmount - (principalPayment * i)
        totalInterest += remainingBalance * monthlyRate
      }
      totalAmount = loanAmount + totalInterest
    }

    const totalOverpay = totalAmount - loanAmount

    setCalculation({
      monthlyPayment,
      totalOverpay,
      totalAmount
    })
  }

  const generateAiResponse = () => {
    // Симуляция ИИ ответа
    const responses = [
      "На основе ваших данных, рекомендуем рассмотреть более длительный срок кредита для снижения ежемесячной нагрузки.",
      "Ваш доход позволяет комфортно обслуживать данный кредит. Рассмотрите возможность досрочного погашения.",
      "Учитывая инфляцию, реальная стоимость кредита будет ниже заявленной. Это выгодное предложение.",
      "Рекомендуем сравнить предложения разных банков перед принятием решения."
    ]

    setAiResponse(responses[Math.floor(Math.random() * responses.length)])
  }

  // Функция добавления в цели
const handleAddToGoals = () => {
  if (!calculation) return

  const loanAmount = parseFloat(amount)
  const loanRate = parseFloat(rate)
  const loanTerm = parseFloat(term)

  try {
    // Создаем дедлайн кредита (текущая дата + срок кредита в годах)
    const currentDate = new Date()
    const deadline = new Date(currentDate.getFullYear() + loanTerm, currentDate.getMonth(), currentDate.getDate())

    // Генерируем название цели на основе типа расчета
    const goalName = calculationType === 'annuity'
      ? 'Кредит (Аннуитетный)'
      : 'Кредит (Дифференцированный)'

    // Формируем объект цели согласно интерфейсу Goal
    const goalData = {
      name: goalName,
      targetAmount: calculation.totalAmount, // Общая сумма выплат
      currentAmount: 0, // Начальное значение
      monthlyContribution: calculation.monthlyPayment, // Ежемесячный платеж
      deadline: deadline.toISOString(), // Дедлайн в ISO формате
      type: 'loan' as const // Тип цели - кредитная
    }

    // Проверка на дубликаты - ищем существующую цель с теми же параметрами
    const existingGoals = goalsAPI.getAll()
    const isDuplicate = existingGoals.some(goal =>
      goal.type === 'loan' &&
      goal.targetAmount === goalData.targetAmount &&
      goal.monthlyContribution === goalData.monthlyContribution &&
      goal.deadline === goalData.deadline
    )

    if (isDuplicate) {
      console.log('Цель с такими параметрами уже существует')
      return
    }

    // Добавляем новую цель
    const newGoal = goalsAPI.add(goalData)
    console.log('Новая кредитная цель добавлена:', newGoal)

  } catch (error) {
    console.error('Ошибка при добавлении цели:', error)
  }
}

  return (
    <motion.div
      className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 hover:shadow-3xl transition-all duration-500"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -5 }}
    >
      <h3 className="text-3xl font-bold text-finovate-navy mb-8 text-center">{title}</h3>

      {/* Основной расчет */}
      <div className="space-y-6 mb-8">
        {/* Выбор метода расчета с кнопкой "В цели" */}
        <div>
          <label className="form-label">Метод расчета</label>
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="annuity"
                  checked={calculationType === 'annuity'}
                  onChange={(e) => setCalculationType(e.target.value as 'annuity')}
                  className="mr-2 text-finovate-orange focus:ring-finovate-orange"
                />
                Аннуитетный
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="differentiated"
                  checked={calculationType === 'differentiated'}
                  onChange={(e) => setCalculationType(e.target.value as 'differentiated')}
                  className="mr-2 text-finovate-orange focus:ring-finovate-orange"
                />
                Дифференцированный
              </label>
            </div>

            {/* Кнопка "В цели" */}
            <AddToGoalsButton
              calculationType={calculationType}
              amount={amount}
              rate={rate}
              term={term}
              calculation={calculation}
              onAddToGoals={handleAddToGoals}
            />
          </div>
        </div>

        {/* Поля ввода */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="form-label">Сумма (тг)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="form-input"
              placeholder="Введите сумму"
              step="1000"
            />
          </div>
          <div>
            <label className="form-label">Ставка/ГЭСВ (%)</label>
            <input
              type="number"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="form-input"
              placeholder="Процентная ставка"
            />
          </div>
          <div>
            <label className="form-label">Срок (год)</label>
            <input
              type="number"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="form-input"
              placeholder="Срок в годах"
            />
          </div>
        </div>

        <motion.button
          onClick={calculateLoan}
          className="w-full btn-primary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Рассчитать кредит
        </motion.button>

        {/* Кнопка переключения между Сравнить/Советы */}
        {showToggleButton && onToggle && (
          <motion.button
            onClick={onToggle}
            className="w-full bg-white border-2 border-finovate-orange text-finovate-orange py-4 px-8 rounded-2xl font-semibold hover:bg-finovate-orange hover:text-white transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {showSecondCalculator ? 'Советы' : 'Сравнить'}
          </motion.button>
        )}
      </div>

      {/* Результаты расчета */}
      <AnimatePresence>
        {calculation && (
          <motion.div
            className="bg-finovate-gray rounded-2xl p-6 mb-8"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h4 className="text-xl font-bold text-finovate-navy mb-4">Результаты расчета</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4">
                <div className="text-sm text-gray-600">Ежемесячный платеж</div>
                <div className="text-2xl font-bold text-finovate-orange">
                  {calculation.monthlyPayment.toLocaleString('kk-KZ')} тг
                </div>
              </div>
              <div className="bg-white rounded-xl p-4">
                <div className="text-sm text-gray-600">Переплата</div>
                <div className="text-2xl font-bold text-finovate-orange">
                  {calculation.totalOverpay.toLocaleString('kk-KZ')} тг
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Продвинутый расчет */}
      <div>
        <motion.button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between p-4 bg-finovate-gray rounded-xl hover:bg-gray-200 transition-colors"
          whileHover={{ scale: 1.01 }}
        >
          <span className="font-semibold text-finovate-navy">Продвинутый расчет</span>
          <motion.svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ rotate: showAdvanced ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </motion.button>

        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              className="mt-6 space-y-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
            >
              {isTargeted && (
                <div>
                  <label className="form-label">Тип предмета</label>
                  <select
                    value={subjectType}
                    onChange={(e) => setSubjectType(e.target.value)}
                    className="form-input"
                  >
                    <option value="">Выберите тип</option>
                    <option value="real_estate">Недвижимость</option>
                    <option value="auto">Автомобиль</option>
                    <option value="equipment">Оборудование</option>
                    <option value="other">Другое</option>
                  </select>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Цель</label>
                  <input
                    type="text"
                    value={advanced.purpose}
                    onChange={(e) => setAdvanced({...advanced, purpose: e.target.value})}
                    className="form-input"
                    placeholder="Например: бизнес, личные нужды"
                  />
                </div>
                <div>
                  <label className="form-label">Причина</label>
                  <input
                    type="text"
                    value={advanced.reason}
                    onChange={(e) => setAdvanced({...advanced, reason: e.target.value})}
                    className="form-input"
                    placeholder="Уровень необходимости"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Доходы (тг)</label>
                  <input
                    type="number"
                    value={advanced.income}
                    onChange={(e) => setAdvanced({...advanced, income: parseFloat(e.target.value) || 0})}
                    className="form-input"
                    placeholder="Ежемесячный доход"
                  />
                </div>
                <div>
                  <label className="form-label">Расходы</label>
                  <input
                    type="text"
                    value={advanced.expenses}
                    onChange={(e) => setAdvanced({...advanced, expenses: e.target.value})}
                    className="form-input"
                    placeholder="Ежемесячные расходы"
                  />
                </div>
                <div>
                  <label className="form-label">Инфляция (%) <span className="text-sm text-gray-500">10-15%</span></label>
                  <input
                    type="number"
                    step="0.1"
                    value={advanced.inflation}
                    onChange={(e) => setAdvanced({...advanced, inflation: parseFloat(e.target.value) || 12})}
                    className="form-input"
                    placeholder="12"
                  />
                </div>
              </div>

              <motion.button
                onClick={generateAiResponse}
                className="w-full btn-secondary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Получить персональный анализ
              </motion.button>

              {aiResponse && (
                <motion.div
                  className="bg-finovate-orange-light rounded-xl p-6 border-l-4 border-finovate-orange"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h5 className="font-bold text-finovate-navy mb-2">Общеперсональный ИИ ответ:</h5>
                  <p className="text-gray-700">{aiResponse}</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// Компонент новостной карточки
const NewsCard = ({ news }: { news: NewsItem }) => (
  <motion.div
    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group"
    whileHover={{ y: -10, scale: 1.02 }}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <div className="h-48 bg-gradient-to-br from-finovate-orange to-finovate-orange-hover flex items-center justify-center">
      <motion.div
        className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center"
        whileHover={{ scale: 1.1, rotate: 360 }}
        transition={{ duration: 0.6 }}
      >
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      </motion.div>
    </div>
    <div className="p-6">
      <div className="text-sm font-semibold text-finovate-orange mb-2">
        {news.source}
      </div>
      <h4 className="text-xl font-bold text-finovate-navy mb-3 group-hover:text-finovate-orange transition-colors">
        {news.title}
      </h4>
      <p className="text-gray-600 mb-4 leading-relaxed">{news.description}</p>
      <motion.a
        href={news.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-finovate-orange font-semibold hover:underline flex items-center"
        whileHover={{ x: 5 }}
        transition={{ duration: 0.2 }}
      >
        Читать далее
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </motion.a>
    </div>
  </motion.div>
)

export default function LoanPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isTargeted, setIsTargeted] = useState(false)
  const [showSecondCalculator, setShowSecondCalculator] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const newsItems: NewsItem[] = [
    {
      id: 1,
      title: "Кто не сможет взять кредит в Казахстане в 2026 ?",
      description: "Рынок потребительского кредитования Казахстана готовится к переменам. Национальный банк объявил о масштабных мерах для сдерживания избыточной закредитованности населения.",
      image: "/news1.jpg",
      link: "https://www.zakon.kz/stati/6495840-kto-ne-smozhet-vzyat-kredit-v-kazakhstane-v-2026-godu.html",
      source: "zakon.kz"
    },
    {
      id: 2,
      title: "Досрочное погашение займа: что важно знать",
      description: "Под досрочным погашением понимается внесение средств на счет займа раньше установленного графика: полностью или частично. Важно понимать, как это влияет на структуру платежей.",
      image: "/news2.jpg",
      link: "https://kmf.kz/en/news-inner/dosrochnoe-pogashenie-kredita-kak-eto-vliyaet-na-pereplatu-i-kogda-eto-dejstvitelno-vygodno/",
      source: "kmf.kz"
    },
    {
      id: 3,
      title: "Более 60% заемщиков в Казахстане пользуются рассрочками",
      description: "По оценкам авторов, рынок розничного кредитования имеет высококонцентрированный характер, особенно в сегментах ипотечных и беззалоговых кредитов.",
      image: "/news3.jpg",
      link: "https://kapital.kz/finance/144627/bolee-60percent-zaemshikov-v-kazahstane-polzuyutsya-rassrochkami.html",
      source: "kapital.kz"
    }
  ]

  const handleToggleView = () => {
    setShowSecondCalculator(!showSecondCalculator)
  }

  return (
    <main className="min-h-screen bg-finovate-navy relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-finovate-orange/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      {/* Header Section */}
      <ScrollRevealWrapper>
        <section className="py-32 relative z-10">
          <div className="container-max">
            <div className="text-center text-white">
              <motion.h1
                className="text-5xl md:text-6xl font-bold mb-8 leading-tight"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Кредитная часть
              </motion.h1>

              <motion.div
                className="max-w-5xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-finovate-orange">
                  Понимание финансовых инструментов
                </h2>
                <p className="text-xl text-blue-100 leading-relaxed">
                  Это раздел, показывающий, как работают финансовые инструменты, которые банки предоставляют людям или организациям с обязательством вернуть их с процентами. Важно понимать цель займа, и уметь принимать и выбирать правильные условия, чтобы он помогал достигать целей, а не приводил к долговой нагрузке. В зависимости от цели, кредит бывает целевым и нецелевым.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </ScrollRevealWrapper>

      {/* Calculators Section */}
      <ScrollRevealWrapper delay={200}>
        <section className="py-20 relative z-10">
          <div className="container-max">
            {/* Таб переключатель */}
            <LoanTypeToggle
              isTargeted={isTargeted}
              onChange={setIsTargeted}
            />

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Первый калькулятор */}
              <LoanCalculator
                title={isTargeted ? "Расчет Целевого Кредита" : "Расчет Нецелевого Кредита"}
                isTargeted={isTargeted}
                showToggleButton={true}
                showSecondCalculator={showSecondCalculator}
                onToggle={handleToggleView}
              />

              {/* Второй калькулятор или блок советов */}
              <AnimatePresence mode="wait">
                {showSecondCalculator ? (
                  <motion.div
                    key="second-calculator"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                  >
                    <LoanCalculator
                      title={isTargeted ? "Сравнение Целевого Кредита" : "Сравнение Нецелевого Кредита"}
                      isTargeted={isTargeted}
                      showToggleButton={false}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="tips-block"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.5 }}
                  >
                    <TipsBlock />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </ScrollRevealWrapper>

      {/* News Section */}
      <ScrollRevealWrapper delay={400}>
        <section className="py-32 bg-gray-50 relative z-10">
          <div className="container-max">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-center text-finovate-navy mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8 }}
            >
              Актуальные новости и советы
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {newsItems.map((news, index) => (
                <motion.div
                  key={news.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.6, delay: 0.2 * index }}
                >
                  <NewsCard news={news} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </ScrollRevealWrapper>
    </main>
  )
}