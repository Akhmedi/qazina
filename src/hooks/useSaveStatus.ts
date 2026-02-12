'use client'

import { useState, useEffect } from 'react'

export function useSaveStatus() {
  const [status, setStatus] = useState<'saved' | 'saving' | 'error'>('saved')

  const setSaving = () => setStatus('saving')
  const setSaved = () => setStatus('saved')
  const setError = () => setStatus('error')

  // Автоматически переводим в saved через 1 секунду после saving
  useEffect(() => {
    if (status === 'saving') {
      const timer = setTimeout(() => {
        setStatus('saved')
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [status])

  return {
    status,
    setSaving,
    setSaved,
    setError,
    isSaving: status === 'saving',
    isSaved: status === 'saved',
    hasError: status === 'error'
  }
}