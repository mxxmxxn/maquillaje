import { useEffect, useState } from 'react'
import { Brush, Crown, Sparkles, Wand2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/integrations/supabase/client'
import ScrollReveal from '@/components/effects/ScrollReveal'

const iconMap: Record<string, LucideIcon> = {
  Crown,
  Sparkles,
  Brush,
  Wand2,
}

type Service = {
  id: string
  icon: string
  name: string
  description: string
  price: string
  sort_order: number
}

const defaultServices: Service[] = [
  {
    id: '1',
    sort_order: 0,
    icon: 'Crown',
    name: 'Novias',
    description: 'Prueba + dia de boda',
    price: '$120',
  },
  {
    id: '2',
    sort_order: 1,
    icon: 'Sparkles',
    name: 'Social Glam',
    description: 'Eventos y fiestas',
    price: '$55',
  },
  {
    id: '3',
    sort_order: 2,
    icon: 'Brush',
    name: 'Editorial',
    description: 'Produccion y sesiones',
    price: '$95',
  },
  {
    id: '4',
    sort_order: 3,
    icon: 'Wand2',
    name: 'Automaquillaje',
    description: 'Clase personalizada',
    price: '$70',
  },
]

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>(defaultServices)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase.from('services').select('*').order('sort_order')
        if (data && data.length > 0) {
          setServices(data as Service[])
        }
      } catch {
        console.error('Error cargando servicios')
      }
    }
    load()
  }, [])

  return (
    <section id="servicios" className="section-padding relative overflow-hidden bg-gradient-light-pink animate-gradient-shift">
      <div className="pointer-events-none absolute -left-24 top-14 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(200,120,160,0.12)_0%,rgba(200,120,160,0)_72%)] blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-8 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(180,100,140,0.10)_0%,rgba(180,100,140,0)_72%)] blur-3xl" />
      <div className="container relative">
        <ScrollReveal>
          <h2 className="section-title">Servicios</h2>
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-12">
          <AnimatePresence mode="wait">
            {services.map((service, index) => {
              const IconComponent = typeof service.icon === 'string' ? iconMap[service.icon] : null
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="group relative flex flex-col items-center justify-center rounded-3xl border border-white/30 bg-white/70 p-6 text-center backdrop-blur-xl shadow-lg transition-all duration-300 hover:border-white/50 hover:bg-white/80"
                >
                  <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0)_70%)] opacity-0 transition-opacity group-hover:opacity-100" />
                  
                  <motion.div
                    className="relative z-10"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3 + index * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    {IconComponent && <IconComponent className="mx-auto mb-4 h-8 w-8 text-foreground/70 transition group-hover:text-accent group-hover:scale-110" />}
                  </motion.div>

                  <h3 className="relative z-10 text-lg font-semibold text-foreground">{service.name}</h3>
                  <p className="relative z-10 mt-2 text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                  <p className="relative z-10 mt-4 text-base font-bold text-accent">{service.price}</p>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {services.length === 0 && (
          <div className="mt-12 text-center text-muted-foreground">
            No hay servicios disponibles
          </div>
        )}
      </div>
    </section>
  )
}
