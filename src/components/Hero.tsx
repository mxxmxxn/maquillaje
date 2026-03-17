import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ArrowDown } from 'lucide-react'
import ParticleField from '@/components/effects/ParticleField'
import TextReveal from '@/components/effects/TextReveal'
import { supabase } from '@/integrations/supabase/client'

type HeroContent = {
  title: string
  description: string
  hero_image_url: string
}

const defaultHero: HeroContent = {
  title: '',
  description: '',
  hero_image_url: '',
}

export default function Hero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 900], [0, 240])
  const scale = useTransform(scrollY, [0, 900], [1, 1.14])
  const contentOpacity = useTransform(scrollY, [0, 550], [1, 0])
  const [hero, setHero] = useState<HeroContent>(defaultHero)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase.from('hero_settings').select('*').limit(1).maybeSingle()
        if (data) {
          setHero(data as HeroContent)
        }
      } catch {
        console.error('Error cargando la seccion principal')
      }
    }

    load()
  }, [])

  return (
    <section id="inicio" className="relative isolate flex min-h-screen items-center overflow-hidden pt-20">
      <motion.div
        style={{ y, scale, backgroundImage: `url(${hero.hero_image_url || '/imagen_maquillaje.jpg'})` }}
        className="absolute inset-0 z-0 bg-cover bg-center"
      />
      <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0.6)_100%)]" />
      <ParticleField />

      <motion.div style={{ opacity: contentOpacity }} className="container relative z-30">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="text-center lg:text-left">
            <TextReveal text={hero.title || 'Diseno de belleza con movimiento, luz y presencia'} className="mx-auto mt-6 max-w-4xl text-5xl leading-[0.95] text-white md:text-7xl lg:mx-0" />

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.75 }}
              className="mx-auto mt-6 max-w-2xl text-sm text-white/90 md:text-lg lg:mx-0"
            >
              {hero.description || 'Un fondo luminoso y delicado acompana cada look para mantener la portada viva sin ocultar la imagen principal.'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
            >
              <a href="https://wa.me/34685647170?text=Hola%2C%20quiero%20reservar%20una%20cita%20de%20maquillaje" target="_blank" rel="noreferrer" className="lg:hidden min-w-[220px] rounded-full border border-white/70 bg-white px-10 py-3 text-center text-sm font-semibold text-neutral-900 shadow-elevated transition hover:scale-[1.02]">
                Contactar
              </a>
              <a href="#contacto" className="hidden min-w-[260px] lg:inline-block rounded-full border border-white/70 bg-white px-12 py-3 text-center text-sm font-semibold text-neutral-900 shadow-elevated transition hover:scale-[1.02]">
                Reservar cita
              </a>
            </motion.div>
          </div>

          <motion.aside
            initial={{ opacity: 0, x: 24, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.35, duration: 0.85 }}
            className="hidden lg:block mx-auto w-full max-w-md rounded-3xl border border-white/35 bg-black/28 p-6 text-white shadow-elevated backdrop-blur-xl"
          >
            <p className="text-xs uppercase tracking-[0.16em] text-white/75">Servicio destacado</p>
            <h3 className="mt-2 font-serif text-3xl leading-tight">Maquillaje social y novias</h3>
            <p className="mt-3 text-sm text-white/85">
              Reserva tu look para eventos, boda o sesion profesional. Trabajo personalizado segun tu tipo de piel, rasgos y estilo.
            </p>
            <div className="mt-6 space-y-2 text-sm text-white/90">
              <p>- Prueba previa de maquillaje</p>
              <p>- Productos premium de larga duracion</p>
              <p>- Desplazamiento y horario flexible</p>
            </div>
            <a
              href="https://wa.me/34685647170?text=Hola%2C%20quiero%20reservar%20una%20cita%20de%20maquillaje"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-white/70 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:scale-[1.02]"
            >
              Reservar por WhatsApp
            </a>
          </motion.aside>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0], opacity: [0.8, 1, 0.8] }}
        transition={{ repeat: Infinity, duration: 1.6, ease: [0.42, 0, 0.58, 1] }}
        className="absolute bottom-7 left-1/2 z-30 -translate-x-1/2"
      >
        <ArrowDown className="h-5 w-5 text-white" />
      </motion.div>
    </section>
  )
}
