import { motion, useMotionValue, useSpring } from 'framer-motion'
import type { PropsWithChildren } from 'react'
import type { HTMLMotionProps } from 'framer-motion'

type MagneticButtonProps = PropsWithChildren<{
  className?: string
  radius?: number
}> &
  Omit<HTMLMotionProps<'button'>, 'children'>

export default function MagneticButton({ children, className, radius = 110, ...props }: MagneticButtonProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { damping: 20, stiffness: 180 })
  const springY = useSpring(y, { damping: 20, stiffness: 180 })

  const handleMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const dx = event.clientX - (rect.left + rect.width / 2)
    const dy = event.clientY - (rect.top + rect.height / 2)
    const distance = Math.hypot(dx, dy)

    if (distance < radius) {
      x.set(dx * 0.2)
      y.set(dy * 0.2)
    } else {
      x.set(0)
      y.set(0)
    }
  }

  return (
    <motion.button
      {...props}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMove}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.button>
  )
}
