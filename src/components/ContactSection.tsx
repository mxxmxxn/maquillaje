import { Instagram, MessageCircle, Send } from 'lucide-react'
import type { FormEvent } from 'react'
import { motion } from 'framer-motion'
import MagneticButton from '@/components/effects/MagneticButton'
import ScrollReveal from '@/components/effects/ScrollReveal'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'

export default function ContactSection() {
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
            <p className="mb-6 max-w-md text-muted-foreground">Cuéntame fecha, horario y estilo deseado para preparar una propuesta a tu medida.</p>
            <div className="flex gap-3">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="rounded-full border p-3 transition hover:-translate-y-1 hover:bg-secondary">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://wa.me/34685647170" target="_blank" rel="noreferrer" className="rounded-full border p-3 transition hover:-translate-y-1 hover:bg-secondary">
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>
        </ScrollReveal>

        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-90px' }}
          transition={{ duration: 0.65 }}
          whileHover={{ y: -4 }}
          className="glass-card space-y-4 p-6 shadow-elevated"
        >
          <Input placeholder="Nombre" name="nombre" required />
          <Input type="email" placeholder="Email" name="email" required />
          <Textarea placeholder="Mensaje" name="mensaje" required />
          <div className="flex flex-wrap gap-3">
            <MagneticButton type="submit" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-white">
              Enviar <Send className="h-4 w-4" />
            </MagneticButton>
            <a href="https://wa.me/34685647170" className="rounded-full bg-green-500 px-6 py-3 font-medium text-white transition hover:scale-[1.03]">WhatsApp</a>
          </div>
        </motion.form>
      </div>
    </section>
  )
}
