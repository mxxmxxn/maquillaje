import type { PropsWithChildren } from 'react'
import { useRef } from 'react'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'
import { cn } from '@/lib/utils'

type FloatingCardProps = PropsWithChildren<{
  className?: string
}>

export default function FloatingCard({ children, className }: FloatingCardProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)

  const rotateXTarget = useTransform(y, [0, 1], [8, -8])
  const rotateYTarget = useTransform(x, [0, 1], [-8, 8])
  const glareXTarget = useTransform(x, (value) => value * 100)
  const glareYTarget = useTransform(y, (value) => value * 100)

  const rotateX = useSpring(rotateXTarget, { damping: 20, stiffness: 200 })
  const rotateY = useSpring(rotateYTarget, { damping: 20, stiffness: 200 })
  const glareX = useSpring(glareXTarget, { damping: 20, stiffness: 200 })
  const glareY = useSpring(glareYTarget, { damping: 20, stiffness: 200 })

  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, hsl(340 72% 87% / 0.15), transparent 60%)`

  return (
    <motion.div
      ref={ref}
      onMouseMove={(event) => {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return

        const nextX = (event.clientX - rect.left) / rect.width
        const nextY = (event.clientY - rect.top) / rect.height
        const clampedX = Math.max(0, Math.min(1, nextX))
        const clampedY = Math.max(0, Math.min(1, nextY))

        // Cursor normalized coordinates drive spring-physics tilt + glare.
        x.set(clampedX)
        y.set(clampedY)
      }}
      onMouseLeave={() => {
        x.set(0.5)
        y.set(0.5)
      }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 800,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      className={cn('relative overflow-hidden rounded-2xl', className)}
    >
      <motion.div className="pointer-events-none absolute inset-0 z-10" style={{ background: glare }} />
      {children}
    </motion.div>
  )
}
        // eslint-disable-next-line no-shadow
