'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface SaveIndicatorProps {
  status: 'saved' | 'saving' | 'error'
}

export default function SaveIndicator({ status }: SaveIndicatorProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium ${
          status === 'saved' 
            ? 'bg-green-100 text-green-700'
            : status === 'saving'
            ? 'bg-finovate-orange-light text-finovate-orange'
            : 'bg-red-100 text-red-700'
        }`}
      >
        {status === 'saving' && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-3 h-3"
          >
            <svg fill="none" viewBox="0 0 24 24" className="w-full h-full">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </motion.div>
        )}

        {status === 'saved' && (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}

        {status === 'error' && (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}

        <span>
          {status === 'saved' ? 'Сохранено' : status === 'saving' ? 'Сохраняю...' : 'Ошибка'}
        </span>
      </motion.div>
    </AnimatePresence>
  )
}