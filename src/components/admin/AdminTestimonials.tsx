import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import ImageUpload from '@/components/admin/ImageUpload'

type Item = {
  id?: string
  name: string
  text: string
  rating: number
  service: string
  photo_url: string
}

const initial: Item = { name: '', text: '', rating: 5, service: '', photo_url: '' }

export default function AdminTestimonials() {
  const [items, setItems] = useState<Item[]>([])
  const [form, setForm] = useState<Item>(initial)

  const load = async () => {
    const { data } = await supabase.from('testimonials').select('*')
    if (data) setItems(data as Item[])
  }

  useEffect(() => {
    load()
  }, [])

  const save = async (event: FormEvent) => {
    event.preventDefault()
    const { error } = await supabase.from('testimonials').upsert(form)
    if (error) return toast({ title: 'Error al guardar testimonios', description: error.message })
    toast({ title: 'Testimonio guardado' })
    setForm(initial)
    load()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Testimonios</h2>
        <p className="text-sm text-muted-foreground">Administra las opiniones de clientes que se muestran en la web.</p>
      </div>
      <form onSubmit={save} className="space-y-4">
        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre" />
        <Textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} placeholder="Texto del testimonio" />
        <Input value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} placeholder="Servicio" />
        <Input type="number" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} placeholder="Valoracion (1-5)" />
        <Input value={form.photo_url} onChange={(e) => setForm({ ...form, photo_url: e.target.value })} placeholder="URL de foto" />
        <ImageUpload onUploaded={(url) => setForm({ ...form, photo_url: url })} />
        <Button type="submit" variant="pink">Guardar testimonio</Button>
      </form>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="glass-card flex items-center justify-between p-3 text-sm">
            <span>{item.name} - {item.service}</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={async () => {
                if (!item.id) return
                await supabase.from('testimonials').delete().eq('id', item.id)
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
