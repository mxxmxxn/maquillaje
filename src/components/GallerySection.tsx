import { useMemo, useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion, useMotionTemplate, useScroll, useSpring, useTransform } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { supabase } from '@/integrations/supabase/client'
import FloatingCard from '@/components/effects/FloatingCard'
import ScrollReveal from '@/components/effects/ScrollReveal'

type GalleryItem = {
  id: string
  category: string
  title: string
  image_url: string
  sort_order: number
}

const defaultItems: GalleryItem[] = [
  { id: '1', category: 'novias', title: 'Glow bridal', image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=900&auto=format&fit=crop', sort_order: 0 },
  { id: '2', category: 'social', title: 'Soft glam', image_url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=900&auto=format&fit=crop', sort_order: 1 },
  { id: '3', category: 'editorial', title: 'Editorial chic', image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=900&auto=format&fit=crop', sort_order: 2 },
  { id: '4', category: 'quince', title: 'Fiesta rose', image_url: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=900&auto=format&fit=crop', sort_order: 3 },
  { id: '5', category: 'novias', title: 'Natural bride', image_url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=900&auto=format&fit=crop', sort_order: 4 },
  { id: '6', category: 'social', title: 'Noche dorada', image_url: 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?q=80&w=900&auto=format&fit=crop', sort_order: 5 },
]

export default function GallerySection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [items, setItems] = useState<GalleryItem[]>(defaultItems)
  const [active, setActive] = useState('todos')
  const [selected, setSelected] = useState<GalleryItem | null>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start 88%', 'end 22%'] })
  const progress = useSpring(scrollYProgress, { damping: 26, stiffness: 120 })
  const headingY = useTransform(progress, [0, 1], [48, -8])
  const headingRotateX = useTransform(progress, [0, 1], [14, 0])
  const headingScale = useTransform(progress, [0, 1], [0.93, 1.03])
  const headingDepth = useTransform(progress, [0, 1], [0, 1])
  const headingShadow = useMotionTemplate`0 ${headingDepth}px 0 rgba(170,98,134,0.32), 0 ${headingDepth}0px 24px rgba(170,98,134,0.2)`
  const captionLift = useTransform(progress, [0, 1], [10, 0])

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase.from('gallery_items').select('*').order('sort_order')
        if (data && data.length > 0) {
          setItems(data as GalleryItem[])
        }
      } catch {
        console.error('Error cargando galeria')
      }
    }
    load()
  }, [])

  const categories = useMemo(() => {
    const cats = new Set(['todos', ...items.map(i => i.category)])
    return Array.from(cats)
  }, [items])

  const filtered = useMemo(() => (active === 'todos' ? items : items.filter((item) => item.category === active)), [active, items])

  return (
    <section ref={sectionRef} id="trabajos" className="section-padding bg-secondary/45 [perspective:1000px]">
      <div className="container">
        <ScrollReveal>
          <motion.h2
            style={{ y: headingY, rotateX: headingRotateX, scale: headingScale, textShadow: headingShadow }}
            className="section-title will-change-transform"
          >
            Trabajos
          </motion.h2>
        </ScrollReveal>
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setActive(category)}
              whileHover={{ y: -2, scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`rounded-full px-4 py-2 text-sm ${active === category ? 'bg-accent text-white' : 'bg-white'}`}
            >
              {category}
            </motion.button>
          ))}
        </div>

        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.92, y: 28 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: -24 }}
                transition={{ type: 'spring', stiffness: 210, damping: 22 }}
              >
                <FloatingCard className="group cursor-pointer">
                  <button className="relative w-full overflow-hidden rounded-2xl" onClick={() => setSelected(item)}>
                    <img src={item.image_url} alt={item.title} loading="lazy" className="h-72 w-full rounded-2xl object-cover" />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-60 transition group-hover:opacity-80" />
                    <motion.span
                      style={{ y: captionLift }}
                      initial={{ y: 0 }}
                      whileHover={{ y: -3 }}
                      className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium [text-shadow:0_1px_0_rgba(120,61,90,0.28)]"
                    >
                      {item.title}
                    </motion.span>
                  </button>
                </FloatingCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <Dialog open={Boolean(selected)} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
          </DialogHeader>
          {selected ? <img src={selected.image_url} alt={selected.title} className="h-[70vh] w-full rounded-2xl object-cover" /> : null}
        </DialogContent>
      </Dialog>
    </section>
  )
}
