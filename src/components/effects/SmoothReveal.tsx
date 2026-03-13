import type { PropsWithChildren } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

type Direction = 'up' | 'left' | 'right'

type SmoothRevealProps = PropsWithChildren<{
  className?: string
  direction?: Direction
  delay?: number
}> 

export default function SmoothReveal({
  children,
  className,
  direction = 'up',
  delay = 0,
}: SmoothRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const initial =
    direction === 'left'
      ? { opacity: 0, x: -60, filter: 'blur(8px)' }
      : direction === 'right'
        ? { opacity: 0, x: 60, filter: 'blur(8px)' }
        : { opacity: 0, y: 60, filter: 'blur(8px)' }

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={inView ? { opacity: 1, x: 0, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.75, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
