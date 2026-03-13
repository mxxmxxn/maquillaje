import { useEffect, useState } from 'react'
import { Instagram, MessageCircle, Send } from 'lucide-react'
import type { FormEvent } from 'react'
import { supabase } from '@/integrations/supabase/client'
import FloatingCard from '@/components/effects/FloatingCard'
import MagneticButton from '@/components/effects/MagneticButton'
import ScrollReveal from '@/components/effects/ScrollReveal'
import SmoothReveal from '@/components/effects/SmoothReveal'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'

type ContactData = {
  description: string
  instagram_url: string
  whatsapp_number: string
  email: string
}

const defaultContact: ContactData = {
  description: 'Cuéntame fecha, horario y estilo deseado para preparar una propuesta a tu medida.',
  instagram_url: 'https://instagram.com',
  whatsapp_number: '34685647170',
  email: '',
}

export default function ContactSection() {
  const [contact, setContact] = useState<ContactData>(defaultContact)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase.from('contact_info').select('*').limit(1).maybeSingle()
        if (data) setContact(data as ContactData)
      } catch {
        console.error('Error cargando contacto')
      }
    }
    load()
  }, [])

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    
    fetch('https://formspree.io/f/xlgpbgzv', {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
      .then(() => {
        toast({ title: 'Mensaje enviado', description: 'Te responderemos lo antes posible.' })
        event.currentTarget.reset()
      })
      .catch(() => {
        toast({ title: 'Error', description: 'No se pudo enviar el mensaje. Intenta de nuevo.' })
      })
  }

  return (
    <section id="contacto" className="section-padding relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute left-0 top-0 h-72 w-72 bg-[radial-gradient(circle,rgba(243,186,207,0.35)_0%,rgba(255,255,255,0)_70%)]" />
      <div className="container relative grid gap-10 lg:grid-cols-2">
        <ScrollReveal>
          <div>
            <h2 className="section-title">Contacto</h2>
            <p className="mb-6 max-w-md text-muted-foreground">{contact.description}</p>
            <div className="flex gap-3">
              {contact.instagram_url && (
                <a href={contact.instagram_url} target="_blank" rel="noreferrer" className="rounded-full border p-3 transition hover:-translate-y-1 hover:bg-secondary">
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              <a href={`https://wa.me/${contact.whatsapp_number}`} target="_blank" rel="noreferrer" className="rounded-full border p-3 transition hover:-translate-y-1 hover:bg-secondary">
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>
        </ScrollReveal>

        <SmoothReveal delay={0.1}>
          <FloatingCard className="relative">
            <form onSubmit={onSubmit} className="glass-card space-y-5 p-8 shadow-elevated md:p-10">
              <Input placeholder="Nombre" name="nombre" required />
              <Input type="email" placeholder="Email" name="email" required />
              <Textarea placeholder="Mensaje" name="mensaje" required />
              <div className="flex flex-wrap gap-3">
                <MagneticButton type="submit" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-white">
                  Enviar <Send className="h-4 w-4" />
                </MagneticButton>
                <a href={`https://wa.me/${contact.whatsapp_number}`} className="rounded-full bg-green-500 px-6 py-3 font-medium text-white transition hover:scale-[1.03]">WhatsApp</a>
              </div>
            </form>
          </FloatingCard>
        </SmoothReveal>
      </div>
    </section>
  )
}
