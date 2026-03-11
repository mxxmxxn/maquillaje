import { motion, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function CustomCursor() {
  const [visible, setVisible] = useState(false)
  const [isTouch, setIsTouch] = useState(false)

  const x = useSpring(0, { damping: 25, stiffness: 300 })
  const y = useSpring(0, { damping: 25, stiffness: 300 })
  const ringX = useSpring(0, { damping: 40, stiffness: 150 })
  const ringY = useSpring(0, { damping: 40, stiffness: 150 })

  useEffect(() => {
    setIsTouch('ontouchstart' in window)
    const move = (event: MouseEvent) => {
      x.set(event.clientX - 4)
      y.set(event.clientY - 4)
      ringX.set(event.clientX - 16)
      ringY.set(event.clientY - 16)
      setVisible(true)
    }

    const leave = () => setVisible(false)

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseleave', leave)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseleave', leave)
    }
  }, [ringX, ringY, x, y])

  if (isTouch) {
    return null
  }

  return (
    <>
      <motion.div
        style={{ x, y }}
        className="pointer-events-none fixed left-0 top-0 z-[90] h-2 w-2 rounded-full bg-[hsl(var(--pink-deep))]"
        animate={{ opacity: visible ? 1 : 0 }}
      />
      <motion.div
        style={{ x: ringX, y: ringY }}
        className="pointer-events-none fixed left-0 top-0 z-[89] h-8 w-8 rounded-full border border-[hsl(var(--accent))]/80"
        animate={{ opacity: visible ? 1 : 0 }}
      />
    </>
  )
}
