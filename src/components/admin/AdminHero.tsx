import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import ImageUpload from '@/components/admin/ImageUpload'

type HeroState = {
  id: string
  title: string
  subtitle: string
  tagline: string
  hero_image_url: string
}

const initial: HeroState = {
  id: 'default',
  title: '',
  subtitle: '',
  tagline: '',
  hero_image_url: '',
}

export default function AdminHero() {
  const [form, setForm] = useState<HeroState>(initial)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('hero_settings').select('*').limit(1).maybeSingle()
      if (data) setForm(data as HeroState)
    }
    load()
  }, [])

  const save = async (event: FormEvent) => {
    event.preventDefault()
    const { error } = await supabase.from('hero_settings').upsert(form)
    if (error) {
      toast({ title: 'Error al guardar la seccion principal', description: error.message })
      return
    }
    toast({ title: 'Seccion principal actualizada' })
  }

  return (
    <form onSubmit={save} className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">Seccion principal</h2>
        <p className="text-sm text-muted-foreground">Aqui defines el texto e imagen del primer bloque de la home.</p>
      </div>
      <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Titulo principal" />
      <Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="Subtitulo" />
      <Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="Frase corta destacada" />
      <Input value={form.hero_image_url} onChange={(e) => setForm({ ...form, hero_image_url: e.target.value })} placeholder="URL de imagen de portada" />
      <ImageUpload onUploaded={(url) => setForm({ ...form, hero_image_url: url })} />
      <Button type="submit" variant="pink">Guardar cambios</Button>
    </form>
  )
}
