import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'

type AboutState = {
  id: string
  description: string
  stat_1_number: number
  stat_1_label: string
  stat_2_number: number
  stat_2_label: string
  stat_3_number: number
  stat_3_label: string
}

const initial: AboutState = {
  id: 'default',
  description: '',
  stat_1_number: 0,
  stat_1_label: '',
  stat_2_number: 0,
  stat_2_label: '',
  stat_3_number: 0,
  stat_3_label: '',
}

export default function AdminAbout() {
  const [form, setForm] = useState<AboutState>(initial)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('about_content').select('*').limit(1).maybeSingle()
      if (data) setForm(data as AboutState)
    }
    load()
  }, [])

  const save = async (event: FormEvent) => {
    event.preventDefault()
    const { error } = await supabase.from('about_content').upsert(form)
    if (error) {
      toast({ title: 'Error al guardar la seccion Sobre mi', description: error.message })
      return
    }
    toast({ title: 'Seccion Sobre mi actualizada' })
  }

  return (
    <form onSubmit={save} className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">Seccion Sobre mi</h2>
        <p className="text-sm text-muted-foreground">Edita tu descripcion y estadisticas destacadas.</p>
      </div>
      <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descripción sobre ti" />
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Ej: Clientes felices</label>
          <div className="flex gap-2">
            <Input type="text" value={form.stat_1_number} onChange={(e) => setForm({ ...form, stat_1_number: Number(e.target.value) || 0 })} placeholder="Ej: 180" className="flex-1" />
            <Input value={form.stat_1_label} onChange={(e) => setForm({ ...form, stat_1_label: e.target.value })} placeholder="Nombre" className="flex-1" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Ej: Años de experiencia</label>
          <div className="flex gap-2">
            <Input type="text" value={form.stat_2_number} onChange={(e) => setForm({ ...form, stat_2_number: Number(e.target.value) || 0 })} placeholder="Ej: 8" className="flex-1" />
            <Input value={form.stat_2_label} onChange={(e) => setForm({ ...form, stat_2_label: e.target.value })} placeholder="Nombre" className="flex-1" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Ej: Certificaciones</label>
          <div className="flex gap-2">
            <Input type="text" value={form.stat_3_number} onChange={(e) => setForm({ ...form, stat_3_number: Number(e.target.value) || 0 })} placeholder="Ej: 35" className="flex-1" />
            <Input value={form.stat_3_label} onChange={(e) => setForm({ ...form, stat_3_label: e.target.value })} placeholder="Nombre" className="flex-1" />
          </div>
        </div>
      </div>
      <Button type="submit" variant="pink">Guardar cambios</Button>
    </form>
  )
}
