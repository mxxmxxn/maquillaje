import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SparklesText from '@/components/effects/SparklesText'
import { supabase } from '@/integrations/supabase/client'

const heartImage = new URL('../assets/Heartwhite.png', import.meta.url).href

const heartPositions = [
  { top: '10%', left: '8%', size: '280px', opacity: '65' },
  { top: '65%', left: '5%', size: '220px', opacity: '62' },
  { top: '20%', right: '10%', size: '240px', opacity: '68' },
  { top: '70%', right: '8%', size: '200px', opacity: '64' },
  { top: '35%', left: '3%', size: '180px', opacity: '60' },
  { top: '50%', right: '15%', size: '260px', opacity: '66' },
  { top: '15%', right: '25%', size: '200px', opacity: '63' },
  { top: '75%', left: '45%', size: '240px', opacity: '61' },
  { top: '40%', right: '5%', size: '200px', opacity: '64' },
  { top: '25%', left: '25%', size: '240px', opacity: '62' },
  { top: '55%', left: '15%', size: '220px', opacity: '65' },
  { top: '80%', right: '35%', size: '180px', opacity: '60' },
  { top: '30%', left: '55%', size: '260px', opacity: '63' },
  { top: '60%', right: '40%', size: '200px', opacity: '66' },
  { top: '5%', left: '35%', size: '220px', opacity: '61' },
  { top: '85%', left: '65%', size: '240px', opacity: '64' },
]

type ServiceCategory = {
  id: string
  name: string
}

type Service = {
  id: string
  name: string
  category_id: string | null
  price: string
  image_url: string
  sort_order: number
}

const defaultServices: Service[] = [
  
]

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [services, setServices] = useState<Service[]>(defaultServices)
  const [categories, setCategories] = useState<ServiceCategory[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: servicesData }, { data: categoriesData }] = await Promise.all([
          supabase.from('services').select('*').order('sort_order'),
          supabase.from('service_categories').select('id, name').order('sort_order'),
        ])
        if (servicesData) {
          setServices(servicesData as Service[])
        }
        if (categoriesData) {
          setCategories(categoriesData as ServiceCategory[])
        }
      } catch {
        console.error('Error cargando servicios')
      }
    }
    load()
  }, [])

  const getCategoryName = (categoryId: string | null) => categories.find((category) => category.id === categoryId)?.name || 'Sin categoria'

  return (
    <section ref={sectionRef} id="servicios" className="section-padding relative overflow-hidden bg-gradient-light-pink animate-gradient-shift [perspective:1000px]">
      <div className="pointer-events-none absolute -left-24 top-14 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(200,120,160,0.06)_0%,rgba(200,120,160,0)_72%)] blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-8 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(180,100,140,0.04)_0%,rgba(180,100,140,0)_72%)] blur-3xl" />
      {heartPositions.map((pos, idx) => (
        <div
          key={idx}
          className="pointer-events-none absolute"
          style={{
            top: pos.top,
            left: pos.left,
            right: pos.right,
            width: pos.size,
            height: pos.size,
            opacity: `${pos.opacity}%`,
          }}
        >
          <img src={heartImage} alt="heart" className="h-full w-full object-contain" />
        </div>
      ))}
      <div className="container relative">
        <SparklesText as="h2" text="Servicios" className="section-title" sparklesCount={9} colors={{ first: '#f5c7d6', second: '#dc89a5' }} />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-12">
          <AnimatePresence mode="wait">
            {services.map((service, index) => {
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
                  <img src={service.image_url} alt={service.name} className="relative z-10 mb-4 h-40 w-full rounded-2xl object-cover" />
                  <h3 className="relative z-10 text-lg font-semibold text-foreground">{service.name}</h3>
                  <p className="relative z-10 mt-2 text-sm text-muted-foreground">{getCategoryName(service.category_id)}</p>
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
