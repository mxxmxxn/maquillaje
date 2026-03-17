import { useEffect, useRef, useState } from 'react'
import { motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { supabase } from '@/integrations/supabase/client'
import CountUp from '@/components/effects/CountUp'
import SparklesText from '@/components/effects/SparklesText'
import SmoothReveal from '@/components/effects/SmoothReveal'

const winkImage = new URL('../assets/Winkblack.png', import.meta.url).href

type AboutData = {
  description: string
  stat_1_number: number
  stat_1_label: string
  stat_2_number: number
  stat_2_label: string
  stat_3_number: number
  stat_3_label: string
}

const defaultAbout: AboutData = {
  description: '',
  stat_1_number: 0,
  stat_1_label: '',
  stat_2_number: 0,
  stat_2_label: '',
  stat_3_number: 0,
  stat_3_label: '',
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [about, setAbout] = useState<AboutData>(defaultAbout)
  const glowX = useMotionValue(30)
  const glowY = useMotionValue(20)
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${glowX}% ${glowY}%, rgba(244,191,210,0.22), transparent 62%)`
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start 85%', 'end 20%'] })
  const progress = useSpring(scrollYProgress, { damping: 26, stiffness: 120 })
  const bodyY = useTransform(progress, [0, 1], [34, 0])

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
    <section ref={sectionRef} id="sobre-mi" onMouseMove={handleMove} className="section-padding relative overflow-hidden bg-white [perspective:1000px]">
      <div className="pointer-events-none absolute inset-0">
        <img src={winkImage} alt="wink background" className="h-full w-full object-cover opacity-15" />
      </div>
      <motion.div style={{ background: spotlight }} className="pointer-events-none absolute inset-0" />
      <div className="container grid items-center gap-12 lg:grid-cols-2 relative z-10">
        <SmoothReveal direction="left">
          <SparklesText as="h2" text="Sobre mi" className="section-title" sparklesCount={9} colors={{ first: '#f5c7d6', second: '#dc89a5' }} />
          <motion.p style={{ y: bodyY }} className="mb-4 text-muted-foreground will-change-transform">
            {about.description}
          </motion.p>

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
