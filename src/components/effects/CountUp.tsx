import { useEffect, useState } from 'react'

type CountUpProps = {
  value: number
  duration?: number
}

export default function CountUp({ value, duration = 1200 }: CountUpProps) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let raf = 0
    const start = performance.now()

    const cubicOut = (t: number) => 1 - Math.pow(1 - t, 3)

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      setDisplay(Math.round(value * cubicOut(progress)))

      if (progress < 1) {
        raf = requestAnimationFrame(tick)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [duration, value])

  return <>{display}</>
}
