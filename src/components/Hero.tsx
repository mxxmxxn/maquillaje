import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'
import { ArrowDown } from 'lucide-react'
import MagneticButton from '@/components/effects/MagneticButton'
import ParticleField from '@/components/effects/ParticleField'
import TextReveal from '@/components/effects/TextReveal'

export default function Hero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 900], [0, 240])
  const scale = useTransform(scrollY, [0, 900], [1, 1.14])
  const contentOpacity = useTransform(scrollY, [0, 550], [1, 0])
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 120, damping: 20 })
  const sy = useSpring(my, { stiffness: 120, damping: 20 })

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      const nx = event.clientX / window.innerWidth - 0.5
      const ny = event.clientY / window.innerHeight - 0.5
      mx.set(nx * 52)
      my.set(ny * 36)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [mx, my])

  return (
    <section id="inicio" className="relative isolate flex min-h-screen items-center overflow-hidden pt-20">
      <motion.div
        style={{ y, scale, backgroundImage: 'url(/imagen_maquillaje.jpg)' }}
        className="absolute inset-0 z-0 bg-cover bg-center opacity-55"
      />
      <div className="absolute inset-0 z-10 bg-[linear-gradient(110deg,rgba(10,9,11,0.72)_0%,rgba(24,16,24,0.56)_46%,rgba(245,231,238,0.18)_100%)]" />
      <ParticleField />

      <motion.div
        style={{ x: sx, y: sy }}
        className="pointer-events-none absolute -left-24 top-16 z-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,175,204,0.62)_0%,rgba(255,255,255,0)_70%)]"
      />
      <motion.div
        style={{ x: useTransform(sx, (v) => -v * 0.55), y: useTransform(sy, (v) => -v * 0.45) }}
        className="pointer-events-none absolute -bottom-12 right-0 z-20 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(239,197,216,0.42)_0%,rgba(255,255,255,0)_70%)]"
      />

      <motion.div style={{ opacity: contentOpacity }} className="container relative z-30">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="text-center lg:text-left">
            <motion.span
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.55 }}
              className="inline-flex items-center rounded-full border border-white/35 bg-black/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm"
            >
              Maquillaje artistico en vivo
            </motion.span>

            <TextReveal text="Diseno de belleza con movimiento, luz y presencia" className="mx-auto mt-6 max-w-4xl text-5xl leading-[0.95] text-white md:text-7xl lg:mx-0" />

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.75 }}
              className="mx-auto mt-6 max-w-2xl text-sm text-white/90 md:text-lg lg:mx-0"
            >
              Mueve el cursor para empujar las particulas. Haz click para activar una onda de atraccion y sentir una escena viva en tiempo real.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
            >
              <a href="https://wa.me/34685647170?text=Hola%2C%20quiero%20reservar%20una%20cita%20de%20maquillaje" target="_blank" rel="noreferrer" className="lg:hidden rounded-full border border-white/70 bg-white px-8 py-3 text-sm font-semibold text-neutral-900 shadow-elevated transition hover:scale-[1.02]">
                Contactar
              </a>
              <a href="#contacto" className="hidden lg:inline-block rounded-full border border-white/70 bg-white px-8 py-3 text-sm font-semibold text-neutral-900 shadow-elevated transition hover:scale-[1.02]">
                Reservar cita
              </a>
              <MagneticButton
                whileTap={{ scale: 0.95, rotate: 1 }}
                transition={{ type: 'spring', stiffness: 360, damping: 13 }}
                className="rounded-full border border-white/45 bg-white/10 px-8 py-3 text-sm font-semibold text-white backdrop-blur-md"
              >
                Ver portfolio
              </MagneticButton>
            </motion.div>
          </div>

          <motion.aside
            initial={{ opacity: 0, x: 24, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.35, duration: 0.85 }}
            style={{ x: useTransform(sx, (v) => v * 0.22), y: useTransform(sy, (v) => v * 0.12) }}
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
