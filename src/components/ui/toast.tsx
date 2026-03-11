import * as ToastPrimitives from '@radix-ui/react-toast'
import type * as React from 'react'
import { cn } from '@/lib/utils'

export const ToastProvider = ToastPrimitives.Provider
export const ToastViewport = ({ className, ...props }: React.ComponentProps<typeof ToastPrimitives.Viewport>) => (
  <ToastPrimitives.Viewport
    className={cn('fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2 outline-none', className)}
    {...props}
  />
)

export const Toast = ({ className, ...props }: React.ComponentProps<typeof ToastPrimitives.Root>) => (
  <ToastPrimitives.Root className={cn('glass-card p-4 shadow-soft', className)} {...props} />
)

export const ToastTitle = ToastPrimitives.Title
export const ToastDescription = ToastPrimitives.Description
