import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

type TextRevealProps = {
  text: string
  className?: string
}

export default function TextReveal({ text, className }: TextRevealProps) {
  const ref = useRef<HTMLHeadingElement | null>(null)
  const inView = useInView(ref, { once: true })
  const words = text.split(' ')

  return (
    <h1 ref={ref} className={className}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          initial={{ opacity: 0, rotateX: 40, y: 16 }}
          animate={inView ? { opacity: 1, rotateX: 0, y: 0 } : {}}
          transition={{ delay: index * 0.04, duration: 0.45 }}
          className="mr-2 inline-block"
        >
          {word}
        </motion.span>
      ))}
    </h1>
  )
}
