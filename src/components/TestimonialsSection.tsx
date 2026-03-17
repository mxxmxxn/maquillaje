import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { motion } from 'framer-motion'
import FloatingCard from '@/components/effects/FloatingCard'
import SparklesText from '@/components/effects/SparklesText'
import { supabase } from '@/integrations/supabase/client'

type Testimonial = {
  id: string
  name: string
  text: string
  rating: number
  category: string
  photo_url: string
}

const defaultTestimonials: Testimonial[] = []

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase.from('testimonials').select('*')
        if (data) {
          setTestimonials(data as Testimonial[])
        }
      } catch {
        console.error('Error cargando testimonios')
      }
    }

    load()
  }, [])

  const looped = [...testimonials, ...testimonials]

  return (
    <section id="testimonios" className="section-padding bg-secondary/50">
      <div className="container">
        <SparklesText as="h2" text="Testimonios" className="section-title" sparklesCount={9} colors={{ first: '#f5c7d6', second: '#dc89a5' }} />
        <p className="mb-6 max-w-2xl text-muted-foreground">Resenas reales en movimiento lateral. Pasa el raton encima para leer con calma.</p>

        <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="marquee-track flex w-max gap-5 py-2 group-hover:[animation-play-state:paused]">
            {looped.map((item, index) => (
              <FloatingCard key={`${item.name}-${index}`} className="glass-card min-h-[220px] w-[320px] p-6">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: item.rating }).map((_, starIndex) => (
                    <motion.div
                      key={starIndex}
                      initial={{ scale: 0, rotate: -90 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring', damping: 10, stiffness: 300, delay: starIndex * 0.04 }}
                    >
                      <Star className="h-4 w-4 fill-[hsl(var(--gold))] text-[hsl(var(--gold))]" />
                    </motion.div>
                  ))}
                </div>
                <p className="italic text-muted-foreground">"{item.text}"</p>
                <p className="mt-4 text-lg font-semibold">{item.name}</p>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.category}</p>
              </FloatingCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
