import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'

type ContactState = {
  id: string
  description: string
  instagram_url: string
  whatsapp_number: string
  email: string
}

const initial: ContactState = {
  id: 'default',
  description: '',
  instagram_url: '',
  whatsapp_number: '',
  email: '',
}

export default function AdminContact() {
  const [form, setForm] = useState<ContactState>(initial)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('contact_info').select('*').limit(1).maybeSingle()
      if (data) setForm(data as ContactState)
    }
    load()
  }, [])

  const save = async (event: FormEvent) => {
    event.preventDefault()
    const { error } = await supabase.from('contact_info').upsert(form)
    if (error) {
      toast({ title: 'Error al guardar contacto', description: error.message })
      return
    }
    toast({ title: 'Información de contacto actualizada' })
  }

  return (
    <form onSubmit={save} className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">Contacto</h2>
        <p className="text-sm text-muted-foreground">Edita la descripción de contacto y tus redes sociales.</p>
      </div>
      <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descripción de contacto" />
      <Input value={form.instagram_url} onChange={(e) => setForm({ ...form, instagram_url: e.target.value })} placeholder="URL de Instagram" />
      <Input value={form.whatsapp_number} onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })} placeholder="Número WhatsApp (ej: 34685647170)" />
      <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" />
      <Button type="submit" variant="pink">Guardar cambios</Button>
    </form>
  )
}
