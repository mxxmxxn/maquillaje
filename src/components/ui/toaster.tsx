import { useToast } from '@/hooks/use-toast'
import { Toast, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '@/components/ui/toast'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map((item) => (
        <Toast key={item.id} open>
          <ToastTitle className="font-semibold">{item.title}</ToastTitle>
          {item.description ? <ToastDescription className="text-sm text-muted-foreground">{item.description}</ToastDescription> : null}
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}
