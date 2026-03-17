import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import ImageUpload from '@/components/admin/ImageUpload'

type ServiceCategory = {
  id: string
  name: string
}

type GalleryItem = {
  id?: string
  image_url: string
  category: string
  title: string
  description: string
  sort_order: number
}

const initial: GalleryItem = { image_url: '', category: '', title: '', description: '', sort_order: 0 }

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [form, setForm] = useState<GalleryItem>(initial)

  const load = async () => {
    const { data } = await supabase.from('gallery_items').select('*').order('sort_order')
    if (data) setItems(data as GalleryItem[])
  }

  const loadCategories = async () => {
    const { data } = await supabase.from('service_categories').select('id, name').order('sort_order')
    if (data) setCategories(data as ServiceCategory[])
  }

  useEffect(() => {
    load()
    loadCategories()
  }, [])

  const save = async (event: FormEvent) => {
    event.preventDefault()
    const { error } = await supabase.from('gallery_items').upsert(form)
    if (error) return toast({ title: 'Error al guardar la galeria', description: error.message })
    toast({ title: 'Item de galeria guardado' })
    setForm(initial)
    load()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Galeria de trabajos</h2>
        <p className="text-sm text-muted-foreground">Agrega o elimina imagenes del portafolio y define su orden.</p>
      </div>
      <form onSubmit={save} className="space-y-4">
        <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Titulo" />
        <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descripción del trabajo" />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Selecciona una categoría</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
        <ImageUpload onUploaded={(url) => setForm({ ...form, image_url: url })} />
        <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} placeholder="Orden" />
        <Button type="submit" variant="pink">Guardar item</Button>
      </form>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold">Vista previa en la web</h3>
          <p className="text-sm text-muted-foreground">Así se ven los trabajos en la página pública</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group relative overflow-hidden rounded-xl cursor-pointer"
            >
              <img src={item.image_url} alt={item.title} className="h-48 w-full object-cover rounded-xl transition group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl" />
              <div className="absolute bottom-2 left-2 right-2">
                <span className="text-xs font-medium text-white bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                  {item.title}
                </span>
                <p className="mt-2 line-clamp-2 text-xs text-white/85">{item.description}</p>
              </div>
            </motion.div>
          ))}
          {items.length === 0 && (
            <p className="col-span-full text-center text-sm text-muted-foreground">No hay imagenes aún. ¡Sube tu primer trabajo!</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Gestion de trabajos</h3>
        <p className="text-sm text-muted-foreground">Lista completa para editar o eliminar</p>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="glass-card flex items-center justify-between p-3 text-sm">
            <span>{item.title} - {item.category} - {item.description}</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={async () => {
                if (!item.id) return
                await supabase.from('gallery_items').delete().eq('id', item.id)
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
