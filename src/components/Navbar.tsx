import { Menu, X } from 'lucide-react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { useState } from 'react'
import MagneticButton from '@/components/effects/MagneticButton'

const links = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#sobre-mi', label: 'Sobre mi' },
  { href: '#trabajos', label: 'Trabajos' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#testimonios', label: 'Testimonios' },
  { href: '#contacto', label: 'Contacto' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 24)
  })

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      className={`fixed inset-x-0 top-0 z-50 transition ${scrolled ? 'bg-white/90 shadow-soft backdrop-blur-lg' : 'bg-transparent'}`}
    >
      <nav className="container flex h-20 items-center justify-between">
        <a href="#inicio" className="text-2xl font-semibold tracking-wide text-gradient">
          Maquillaje Pro
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <MagneticButton
              key={link.href}
              className={`relative text-sm transition ${scrolled ? 'text-foreground/80 hover:text-foreground' : 'text-white/90 hover:text-white'}`}
              onMouseEnter={() => setHovered(link.href)}
              onMouseLeave={() => setHovered(null)}
            >
              <a href={link.href}>{link.label}</a>
              {hovered === link.href ? (
                <motion.span
                  layoutId="nav-active"
                  className={`absolute -bottom-1 left-0 h-0.5 w-full rounded-full ${scrolled ? 'bg-accent' : 'bg-white'}`}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              ) : null}
            </MagneticButton>
          ))}
        </div>

        <button className="rounded-full border p-2 md:hidden" onClick={() => setOpen((v) => !v)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0 }}
        className="overflow-hidden border-t bg-white md:hidden"
      >
        <div className="container py-3">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="block py-2 text-sm" onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
        </div>
      </motion.div>
    </motion.header>
  )
}
