import { useEffect, useState } from 'react'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { supabase } from '@/integrations/supabase/client'
import CountUp from '@/components/effects/CountUp'
import ScrollReveal from '@/components/effects/ScrollReveal'
import SmoothReveal from '@/components/effects/SmoothReveal'

type AboutData = {
  paragraph_1: string
  paragraph_2: string
  stat_1_number: number
  stat_1_label: string
  stat_2_number: number
  stat_2_label: string
  stat_3_number: number
  stat_3_label: string
}

const defaultAbout: AboutData = {
  paragraph_1: 'Soy maquilladora profesional especializada en piel real y acabados elegantes. Cada look se adapta a tu estilo y evento.',
  paragraph_2: 'Trabajo con tecnicas actuales, productos premium y una experiencia cercana para que disfrutes el proceso desde el primer minuto.',
  stat_1_number: 180,
  stat_1_label: 'Clientes felices',
  stat_2_number: 8,
  stat_2_label: 'Anios de experiencia',
  stat_3_number: 35,
  stat_3_label: 'Cursos certificados',
}

export default function AboutSection() {
  const [about, setAbout] = useState<AboutData>(defaultAbout)
  const glowX = useMotionValue(30)
  const glowY = useMotionValue(20)
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${glowX}% ${glowY}%, rgba(244,191,210,0.22), transparent 62%)`

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase.from('about_content').select('*').limit(1).maybeSingle()
        if (data) setAbout(data as AboutData)
      } catch {
        console.error('Error cargando seccion sobre mi')
      }
    }
    load()
  }, [])

  const stats = [
    { number: about.stat_1_number, label: about.stat_1_label },
    { number: about.stat_2_number, label: about.stat_2_label },
    { number: about.stat_3_number, label: about.stat_3_label },
  ]

  const handleMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    glowX.set(x)
    glowY.set(y)
  }

  return (
    <section id="sobre-mi" onMouseMove={handleMove} className="section-padding relative overflow-hidden bg-white">
      <motion.div style={{ background: spotlight }} className="pointer-events-none absolute inset-0" />
      <div className="container grid items-center gap-12 lg:grid-cols-2">
        <SmoothReveal direction="left">
          <ScrollReveal>
            <h2 className="section-title">Sobre mi</h2>
          </ScrollReveal>
          <p className="mb-4 text-muted-foreground">
            {about.paragraph_1}
          </p>
          <p className="mb-6 text-muted-foreground">
            {about.paragraph_2}
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((item) => (
              <motion.div
                key={item.label}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 240, damping: 16 }}
                className="glass-card p-4 text-center"
              >
                <p className="text-3xl font-semibold text-gradient">
                  <CountUp value={item.number} />+
                </p>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </SmoothReveal>

        <SmoothReveal direction="right">
          <motion.img
            src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1200&auto=format&fit=crop"
            alt="Maquilladora profesional"
            loading="lazy"
            className="h-[520px] w-full rounded-3xl object-cover shadow-elevated"
            initial={{ y: 70, scale: 1.06 }}
            whileInView={{ y: -45, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ rotate: -1.2, scale: 1.02 }}
            transition={{ type: 'spring', damping: 26, stiffness: 120 }}
          />
        </SmoothReveal>
      </div>
    </section>
  )
}
