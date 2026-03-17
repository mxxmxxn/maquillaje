import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'

type ServiceCategory = {
  id: string
  name: string
}

type Service = {
  id?: string
  icon: string
  name: string
  description: string
  category_id: string | null
  price: string
  sort_order: number
}

const ICON_OPTIONS = ['Crown', 'Sparkles', 'Brush', 'Wand2', 'Star', 'Heart', 'Gem', 'Palette']

const initial: Service = { icon: 'Sparkles', name: '', description: '', category_id: null, price: '', sort_order: 0 }

export default function AdminServices() {
  const [items, setItems] = useState<Service[]>([])
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [form, setForm] = useState<Service>(initial)

  const loadCategories = async () => {
    const { data } = await supabase.from('service_categories').select('id, name').order('sort_order')
    if (data) setCategories(data as ServiceCategory[])
  }

  const load = async () => {
    const { data } = await supabase.from('services').select('*').order('sort_order')
    if (data) setItems(data as Service[])
  }

  useEffect(() => {
    loadCategories()
    load()
  }, [])

  const save = async (event: FormEvent) => {
    event.preventDefault()
    if (!form.category_id) {
      toast({ title: 'Error', description: 'Debes seleccionar una categoría' })
      return
    }
    const { error } = await supabase.from('services').upsert(form)
    if (error) return toast({ title: 'Error al guardar servicios', description: error.message })
    toast({ title: 'Servicio guardado' })
    setForm(initial)
    load()
  }

  const getCategoryName = (categoryId: string | null) => {
    return categories.find(c => c.id === categoryId)?.name || 'Sin categoría'
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Servicios</h2>
        <p className="text-sm text-muted-foreground">Gestiona logo, categoría, tipo de servicio y precio.</p>
      </div>
      <form onSubmit={save} className="space-y-4">
        <select
          value={form.icon}
          onChange={(e) => setForm({ ...form, icon: e.target.value })}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {ICON_OPTIONS.map(icon => (
            <option key={icon} value={icon}>{icon}</option>
          ))}
        </select>
        <select
          value={form.category_id || ''}
          onChange={(e) => setForm({ ...form, category_id: e.target.value || null })}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Selecciona una categoría</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Tipo de servicio" />
        <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descripción del servicio" />
        <Input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Precio" />
        <Button type="submit" variant="pink">Guardar servicio</Button>
      </form>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold">Vista previa en la web</h3>
          <p className="text-sm text-muted-foreground">Así se ven los servicios en la página pública</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center rounded-full border border-white/24 bg-gradient-to-b from-white/10 to-white/5 p-4 text-center backdrop-blur-md"
            >
              <h4 className="text-sm font-semibold">{item.name}</h4>
              <p className="mt-2 text-xs text-muted-foreground line-clamp-3">{item.description}</p>
              <p className="text-xs text-muted-foreground mt-1">{getCategoryName(item.category_id)}</p>
              <p className="mt-2 text-sm font-semibold text-accent">{item.price}</p>
            </motion.div>
          ))}
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
            <span>{item.name} - {item.price} - {item.description}</span>
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
