import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'

type ServiceCategory = {
  id?: string
  name: string
  color: string
  sort_order: number
}

const initial: ServiceCategory = { name: '', color: '#FF69B4', sort_order: 0 }

export default function AdminCategories() {
  const [items, setItems] = useState<ServiceCategory[]>([])
  const [form, setForm] = useState<ServiceCategory>(initial)

  const load = async () => {
    const { data } = await supabase.from('service_categories').select('*').order('sort_order')
    if (data) setItems(data as ServiceCategory[])
  }

  useEffect(() => {
    load()
  }, [])

  const save = async (event: FormEvent) => {
    event.preventDefault()
    if (!form.name.trim()) {
      toast({ title: 'Error', description: 'El nombre es requerido' })
      return
    }
    const { error } = await supabase.from('service_categories').upsert(form)
    if (error) return toast({ title: 'Error al guardar categoría', description: error.message })
    toast({ title: 'Categoría guardada' })
    setForm(initial)
    load()
  }

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from('service_categories').delete().eq('id', id)
    if (error) return toast({ title: 'Error al eliminar', description: error.message })
    toast({ title: 'Categoría eliminada' })
    load()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Categorías de Servicios</h2>
        <p className="text-sm text-muted-foreground">Gestiona las categorías disponibles para los servicios.</p>
      </div>

      <form onSubmit={save} className="space-y-4">
        <Input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Nombre de la categoría"
        />
        <div className="flex gap-2">
          <Input
            type="color"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            placeholder="Color"
            className="h-10 w-24"
          />
          <span className="text-sm text-muted-foreground pt-2">{form.color}</span>
        </div>
        <Input
          type="number"
          value={form.sort_order}
          onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
          placeholder="Orden"
        />
        <Button type="submit" variant="pink">
          Guardar categoría
        </Button>
      </form>

      <div>
        <h3 className="text-lg font-semibold">Categorías existentes</h3>
        <p className="text-sm text-muted-foreground">Lista de todas las categorías</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-3">
              <div
                className="h-8 w-8 rounded-full border border-white/25"
                style={{ backgroundColor: item.color }}
              />
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-xs text-muted-foreground">Orden: {item.sort_order}</p>
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => item.id && deleteItem(item.id)}
            >
              Eliminar
            </Button>
          </motion.div>
        ))}
        {items.length === 0 && (
          <p className="col-span-full text-center text-sm text-muted-foreground">
            No hay categorías aún. ¡Agrega una!
          </p>
        )}
      </div>
    </div>
  )
}
