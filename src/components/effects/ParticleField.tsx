import { useEffect, useRef } from 'react'

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const particleCount = 170
    const rand = (seed: number) => {
      const x = Math.sin(seed * 128.321) * 43758.5453
      return x - Math.floor(x)
    }

    const particles = Array.from({ length: particleCount }, (_, i) => {
      const t = i + 1
      return {
        x: rand(t + 1) * window.innerWidth,
        y: rand(t + 2) * window.innerHeight,
        vx: (rand(t + 3) - 0.5) * 0.05,
        vy: (rand(t + 4) - 0.5) * 0.05,
        baseSize: 1.6 + rand(t + 5) * 3,
        alpha: 0.15 + rand(t + 6) * 0.28,
        driftPhase: rand(t + 7) * Math.PI * 2,
        driftSpeed: 0.0018 + rand(t + 8) * 0.0038,
        driftAmp: 0.025 + rand(t + 9) * 0.11,
      }
    })

    const ripples: Array<{ x: number; y: number; r: number; alpha: number }> = []
    const pointer = {
      x: -9999,
      y: -9999,
      active: false,
      attractUntil: 0,
    }

    let raf = 0
    let width = 0
    let height = 0
    let dpr = 1

    const resize = () => {
      width = canvas.clientWidth
      height = canvas.clientHeight
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      const now = performance.now()
      const attractMode = now < pointer.attractUntil

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Static floating motion with subtle local drift (no top-to-bottom fall).
        p.vx += Math.sin(now * p.driftSpeed + p.driftPhase) * p.driftAmp * 0.02
        p.vy += Math.cos(now * p.driftSpeed + p.driftPhase * 0.8) * p.driftAmp * 0.02

        if (pointer.active) {
          const dx = pointer.x - p.x
          const dy = pointer.y - p.y
          const dist = Math.hypot(dx, dy)
          const radius = attractMode ? 240 : 190

          if (dist < radius && dist > 0.001) {
            const strength = (1 - dist / radius) * (attractMode ? 0.24 : -0.28)
            p.vx += (dx / dist) * strength
            p.vy += (dy / dist) * strength
          }
        }

        p.vx *= 0.992
        p.vy *= 0.992
        p.x += p.vx
        p.y += p.vy

        if (p.x < -20) p.x = width + 20
        if (p.x > width + 20) p.x = -20
        if (p.y < -20) p.y = height + 20
        if (p.y > height + 20) p.y = -20

        if (pointer.active) {
          const shimmer = Math.sin((now * 0.0025) + i * 0.7) * 0.5 + 0.5
          const size = p.baseSize + shimmer * 0.9
          const glow = 18 + shimmer * 12
          ctx.beginPath()
          ctx.shadowBlur = glow
          ctx.shadowColor = 'rgba(214,111,148,0.5)'
          ctx.fillStyle = `rgba(231,150,182,${p.alpha})`
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
          ctx.fill()
          ctx.shadowBlur = 0
        } else {
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.baseSize * 2.6)
          gradient.addColorStop(0, `rgba(223,123,163,${Math.min(0.4, p.alpha + 0.1)})`)
          gradient.addColorStop(1, 'rgba(223,123,163,0)')

          ctx.beginPath()
          ctx.fillStyle = gradient
          ctx.arc(p.x, p.y, p.baseSize * 2.6, 0, Math.PI * 2)
          ctx.fill()

          ctx.beginPath()
          ctx.fillStyle = `rgba(231,150,182,${p.alpha})`
          ctx.arc(p.x, p.y, p.baseSize, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i]
        ripple.r += 2.8
        ripple.alpha -= 0.012
        if (ripple.alpha <= 0) {
          ripples.splice(i, 1)
          continue
        }
        ctx.beginPath()
        ctx.strokeStyle = `rgba(255,245,250,${ripple.alpha.toFixed(3)})`
        ctx.lineWidth = 1.5
        ctx.arc(ripple.x, ripple.y, ripple.r, 0, Math.PI * 2)
        ctx.stroke()
      }

      raf = requestAnimationFrame(render)
    }

    const onMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
      pointer.active = true
    }

    const onDown = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      pointer.x = x
      pointer.y = y
      pointer.active = true
      pointer.attractUntil = performance.now() + 1200
      ripples.push({ x, y, r: 8, alpha: 0.45 })
    }

    const onLeave = () => {
      pointer.active = false
      pointer.x = -9999
      pointer.y = -9999
    }

    resize()
    render()

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-20 h-full w-full" style={{ display: 'block' }} aria-hidden="true" />
}
