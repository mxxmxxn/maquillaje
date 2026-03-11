import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Brush, Crown, Sparkles, Wand2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'

const iconMap: Record<string, LucideIcon> = {
  Crown,
  Sparkles,
  Brush,
  Wand2,
}

type Service = {
  id?: string
  name: string
  description: string
  price: string
  icon: string
  sort_order: number
}

const initial: Service = { name: '', description: '', price: '', icon: 'Sparkles', sort_order: 0 }

export default function AdminServices() {
  const [items, setItems] = useState<Service[]>([])
  const [form, setForm] = useState<Service>(initial)

  const load = async () => {
    const { data } = await supabase.from('services').select('*').order('sort_order')
    if (data) setItems(data as Service[])
  }

  useEffect(() => {
    load()
  }, [])

  const save = async (event: FormEvent) => {
    event.preventDefault()
    const { error } = await supabase.from('services').upsert(form)
    if (error) return toast({ title: 'Error al guardar servicios', description: error.message })
    toast({ title: 'Servicio guardado' })
    setForm(initial)
    load()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Servicios</h2>
        <p className="text-sm text-muted-foreground">Gestiona nombre, descripcion, precio, icono y orden de cada servicio.</p>
      </div>
      <form onSubmit={save} className="space-y-4">
        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre" />
        <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descripcion" />
        <Input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Precio" />
        <Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Icono (ej: Sparkles, Crown, Brush)" />
        <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} placeholder="Orden" />
        <Button type="submit" variant="pink">Guardar servicio</Button>
      </form>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold">Vista previa en la web</h3>
          <p className="text-sm text-muted-foreground">Así se ven los servicios en la página pública</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => {
            const IconComponent = iconMap[item.icon]
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center rounded-full border border-white/24 bg-gradient-to-b from-white/10 to-white/5 p-4 text-center backdrop-blur-md"
              >
                {IconComponent && <IconComponent className="mb-2 h-6 w-6 text-foreground/75" />}
                <h4 className="text-sm font-semibold">{item.name}</h4>
                <p className="text-xs text-muted-foreground">{item.description}</p>
                <p className="mt-2 text-sm font-semibold text-accent">{item.price}</p>
              </motion.div>
            )
          })}
          {items.length === 0 && (
            <p className="col-span-full text-center text-sm text-muted-foreground">No hay servicios aún. ¡Agrega uno!</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Gestion de servicios</h3>
        <p className="text-sm text-muted-foreground">Lista completa para editar o eliminar</p>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="glass-card flex items-center justify-between p-3 text-sm">
            <span>{item.name} - {item.price}</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={async () => {
                if (!item.id) return
                await supabase.from('services').delete().eq('id', item.id)
                load()
              }}
            >
              Eliminar
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
