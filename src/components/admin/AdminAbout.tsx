import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'

type AboutState = {
  id: string
  paragraph_1: string
  paragraph_2: string
  paragraph_3: string
  stat_1_number: number
  stat_1_label: string
  stat_2_number: number
  stat_2_label: string
  stat_3_number: number
  stat_3_label: string
}

const initial: AboutState = {
  id: 'default',
  paragraph_1: '',
  paragraph_2: '',
  paragraph_3: '',
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
        <p className="text-sm text-muted-foreground">Edita tu descripcion, foto y estadisticas destacadas.</p>
      </div>
      <Textarea value={form.paragraph_1} onChange={(e) => setForm({ ...form, paragraph_1: e.target.value })} placeholder="Descripción sobre ti" />
      <Textarea value={form.paragraph_2} onChange={(e) => setForm({ ...form, paragraph_2: e.target.value })} placeholder="Descripción adicional" />
      <Textarea value={form.paragraph_3} onChange={(e) => setForm({ ...form, paragraph_3: e.target.value })} placeholder="Descripción adicional 2" />
      <div className="grid gap-3">
        <Input type="number" value={form.stat_1_number} onChange={(e) => setForm({ ...form, stat_1_number: Number(e.target.value) })} placeholder="Numero" />
        <Input value={form.stat_1_label} onChange={(e) => setForm({ ...form, stat_1_label: e.target.value })} placeholder="Ej: Clientes felices" />
      </div>
      <div className="grid gap-3">
        <Input type="number" value={form.stat_2_number} onChange={(e) => setForm({ ...form, stat_2_number: Number(e.target.value) })} placeholder="Numero" />
        <Input value={form.stat_2_label} onChange={(e) => setForm({ ...form, stat_2_label: e.target.value })} placeholder="Ej: Años de experiencia" />
      </div>
      <div className="grid gap-3">
        <Input type="number" value={form.stat_3_number} onChange={(e) => setForm({ ...form, stat_3_number: Number(e.target.value) })} placeholder="Numero" />
        <Input value={form.stat_3_label} onChange={(e) => setForm({ ...form, stat_3_label: e.target.value })} placeholder="Ej: Certificaciones" />
      </div>
      <Button type="submit" variant="pink">Guardar cambios</Button>
    </form>
  )
}
