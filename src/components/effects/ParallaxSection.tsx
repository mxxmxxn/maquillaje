import type { PropsWithChildren } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

type ParallaxSectionProps = PropsWithChildren<{
  offset?: number
  className?: string
}>

export default function ParallaxSection({ children, className, offset = 120 }: ParallaxSectionProps) {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset])

  return (
    <motion.div style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}
