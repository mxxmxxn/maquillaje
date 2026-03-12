import { Heart, Instagram, MessageCircle, Music2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import MagneticButton from '@/components/effects/MagneticButton'

export default function Footer() {
  const navigate = useNavigate()

  return (
    <footer className="section-padding bg-foreground text-white">
      <div className="container grid gap-10 md:grid-cols-3">
        <div>
          <button
            onClick={() => navigate('/admin')}
            className="mb-2 text-2xl font-semibold hover:text-[hsl(var(--primary))] transition-colors cursor-pointer"
          >
            Maquillaje Pro
          </button>
          <p className="text-sm text-white/70">Belleza editorial y social con enfoque personalizado.</p>
        </div>

        <div>
          <p className="mb-3 text-sm uppercase tracking-wide text-white/70">Enlaces</p>
          <div className="space-y-1 text-sm">
            <a href="#sobre-mi" className="block hover:text-[hsl(var(--primary))]">Sobre mi</a>
            <a href="#trabajos" className="block hover:text-[hsl(var(--primary))]">Galeria</a>
            <a href="#contacto" className="block hover:text-[hsl(var(--primary))]">Contacto</a>
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm uppercase tracking-wide text-white/70">Redes</p>
          <div className="flex gap-3">
            {[Instagram, MessageCircle, Music2].map((Icon, i) => (
              <MagneticButton key={i} className="rounded-full border border-white/25 p-3 hover:bg-white/10">
                <Icon className="h-4 w-4" />
              </MagneticButton>
            ))}
          </div>
        </div>
      </div>

      <p className="container mt-10 flex items-center gap-2 text-xs text-white/60">
        Hecho con <Heart className="h-3 w-3 animate-pulse text-pink-300" /> {new Date().getFullYear()}.
      </p>
    </footer>
  )
}
