import type { PropsWithChildren } from 'react'
import { motion, useInView, useSpring } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

type ScrollSectionProps = PropsWithChildren<{
  className?: string
  effect?: 'curtain'
  intensity?: number
}>

export default function ScrollSection({
  children,
  className,
  effect = 'curtain',
  intensity = 1,
}: ScrollSectionProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { once: true, margin: '-120px' })

  const ySpring = useSpring(200 * intensity, { damping: 30, stiffness: 80 })
  const opacitySpring = useSpring(0, { damping: 30, stiffness: 80 })
  const blurSpring = useSpring(12 * intensity, { damping: 30, stiffness: 80 })

  useEffect(() => {
    if (effect !== 'curtain') return
    if (inView) {
      ySpring.set(0)
      opacitySpring.set(1)
      blurSpring.set(0)
      return
    }
    ySpring.set(200 * intensity)
    opacitySpring.set(0)
    blurSpring.set(12 * intensity)
  }, [blurSpring, effect, inView, intensity, opacitySpring, ySpring])

  return (
    <motion.div
      ref={ref}
      style={{
        y: ySpring,
        opacity: opacitySpring,
        filter: blurSpring.to((value) => `blur(${value}px)`),
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}