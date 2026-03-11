import { Star } from 'lucide-react'
import { motion } from 'framer-motion'
import FloatingCard from '@/components/effects/FloatingCard'
import ScrollReveal from '@/components/effects/ScrollReveal'

const testimonials = [
  { name: 'Andrea', text: 'Increible resultado, duracion perfecta toda la noche.', service: 'Social Glam', rating: 5 },
  { name: 'Lucia', text: 'Mi look de novia fue exactamente como lo sonaba.', service: 'Novias', rating: 5 },
  { name: 'Nadia', text: 'Atencion super profesional y maquillaje elegante.', service: 'Editorial', rating: 5 },
  { name: 'Sofia', text: 'La piel se veia luminosa y natural incluso en fotos con flash.', service: 'Novias', rating: 5 },
  { name: 'Valeria', text: 'Puntual, detallista y con muy buen gusto para elegir tonos.', service: 'Social Glam', rating: 5 },
  { name: 'Camila', text: 'Me encanto la asesoria previa, supo entender justo lo que queria.', service: 'Prueba Novia', rating: 5 },
  { name: 'Paula', text: 'Trabajo fino, limpio y muy duradero. Repetire seguro.', service: 'Evento de noche', rating: 5 },
  { name: 'Marta', text: 'Quedo precioso en video y en persona, cero efecto pesado.', service: 'Editorial', rating: 5 },
  { name: 'Elena', text: 'Todo el proceso fue muy comodo y profesional, super recomendada.', service: 'Social Glam', rating: 5 },
  { name: 'Irene', text: 'Me senti guapisima y segura toda la boda, fue un acierto total.', service: 'Novias', rating: 5 },
]

export default function TestimonialsSection() {
  const looped = [...testimonials, ...testimonials]

  return (
    <section id="testimonios" className="section-padding bg-secondary/50">
      <div className="container">
        <ScrollReveal>
          <h2 className="section-title">Testimonios</h2>
        </ScrollReveal>
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
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.service}</p>
              </FloatingCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
