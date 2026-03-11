import { useEffect, useState } from 'react'

export type ToastType = {
  id: string
  title: string
  description?: string
}

let listeners: Array<(toasts: ToastType[]) => void> = []
let memoryToasts: ToastType[] = []

function emit(toasts: ToastType[]) {
  memoryToasts = toasts
  listeners.forEach((listener) => listener(toasts))
}

export function toast(payload: Omit<ToastType, 'id'>) {
  const id = crypto.randomUUID()
  const next = [...memoryToasts, { ...payload, id }]
  emit(next)

  setTimeout(() => {
    emit(memoryToasts.filter((t) => t.id !== id))
  }, 3500)
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastType[]>(memoryToasts)

  useEffect(() => {
    listeners.push(setToasts)
    return () => {
      listeners = listeners.filter((l) => l !== setToasts)
    }
  }, [])

  return { toasts, toast }
}
