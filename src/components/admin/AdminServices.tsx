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
  color: string
}

type Service = {
  id?: string
  name: string
  description: string
  price: string
  category_id: string | null
  sort_order: number
}

const initial: Service = { name: '', description: '', price: '', category_id: null, sort_order: 0 }

export default function AdminServices() {
  const [items, setItems] = useState<Service[]>([])
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [form, setForm] = useState<Service>(initial)

  const loadCategories = async () => {
    const { data } = await supabase.from('service_categories').select('*').order('sort_order')
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

  const getCategoryColor = (categoryId: string | null) => {
    return categories.find(c => c.id === categoryId)?.color || '#FF69B4'
  }

  const getCategoryName = (categoryId: string | null) => {
    return categories.find(c => c.id === categoryId)?.name || 'Sin categoría'
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Servicios</h2>
        <p className="text-sm text-muted-foreground">Gestiona nombre, descripcion, categoría y precio de cada servicio.</p>
      </div>
      <form onSubmit={save} className="space-y-4">
        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre" />
        <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descripcion" />
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
              <div
                className="mb-2 h-6 w-6 rounded-full border-2 border-white/50"
                style={{ backgroundColor: getCategoryColor(item.category_id) }}
              />
              <h4 className="text-sm font-semibold">{item.name}</h4>
              <p className="text-xs text-muted-foreground">{item.description}</p>
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
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full border border-white/50"
                style={{ backgroundColor: getCategoryColor(item.category_id) }}
              />
              <span>{item.name} - {item.price}</span>
            </div>
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
