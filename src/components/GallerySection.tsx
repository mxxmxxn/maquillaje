import { useMemo, useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import SparklesText from '@/components/effects/SparklesText'
import { supabase } from '@/integrations/supabase/client'
import FloatingCard from '@/components/effects/FloatingCard'

type GalleryItem = {
  id: string
  category: string
  title: string
  image_url: string
  sort_order: number
}

const defaultItems: GalleryItem[] = []

export default function GallerySection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [items, setItems] = useState<GalleryItem[]>(defaultItems)
  const [active, setActive] = useState('todos')
  const [selected, setSelected] = useState<GalleryItem | null>(null)

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
        <SparklesText as="h2" text="Trabajos" className="section-title" sparklesCount={9} colors={{ first: '#f5c7d6', second: '#dc89a5' }} />
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
                    <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium [text-shadow:0_1px_0_rgba(120,61,90,0.28)]">
                      {item.title}
                    </span>
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
