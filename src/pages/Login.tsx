import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/use-toast'

export default function Login() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    try {
      await signIn(email, password)
      toast({ title: 'Sesion iniciada correctamente' })
      navigate('/admin')
    } catch (error) {
      toast({ title: 'No se pudo iniciar sesion', description: 'Revisa tu correo y contrasena e intentalo de nuevo.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-secondary/40 px-6">
      <form onSubmit={onSubmit} className="glass-card w-full max-w-md space-y-4 p-8">
        <h1 className="text-4xl font-semibold">Acceso Admin</h1>
        <p className="text-sm text-muted-foreground">Inicia sesion con tu cuenta administradora de Supabase.</p>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo electronico" required />
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contrasena" required />
        <Button className="w-full" variant="pink" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
    </main>
  )
}
