import type { PropsWithChildren } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

type FloatingCardProps = PropsWithChildren<{
  className?: string
}>

export default function FloatingCard({ children, className }: FloatingCardProps) {
  const rotateXRaw = useMotionValue(0)
  const rotateYRaw = useMotionValue(0)
  const glareXRaw = useMotionValue(50)
  const glareYRaw = useMotionValue(50)

  const rotateX = useSpring(rotateXRaw, { damping: 20, stiffness: 200 })
  const rotateY = useSpring(rotateYRaw, { damping: 20, stiffness: 200 })
  const glareX = useSpring(glareXRaw, { damping: 20, stiffness: 200 })
  const glareY = useSpring(glareYRaw, { damping: 20, stiffness: 200 })

  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.45), rgba(255,255,255,0) 55%)`

  return (
    <motion.div
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const x = (event.clientX - rect.left) / rect.width
        const y = (event.clientY - rect.top) / rect.height
        rotateYRaw.set((x - 0.5) * 16)
        rotateXRaw.set((0.5 - y) * 16)
        glareXRaw.set(x * 100)
        glareYRaw.set(y * 100)
      }}
      onMouseLeave={() => {
        rotateXRaw.set(0)
        rotateYRaw.set(0)
        glareXRaw.set(50)
        glareYRaw.set(50)
      }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      className={cn('relative overflow-hidden rounded-2xl', className)}
    >
      <motion.div className="pointer-events-none absolute inset-0 z-10" style={{ background: glare }} />
      {children}
    </motion.div>
  )
}
