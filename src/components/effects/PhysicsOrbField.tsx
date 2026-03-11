import { useEffect, useRef } from 'react'

type Orb = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  m: number
}

type Ripple = {
  x: number
  y: number
  radius: number
  strength: number
}

const ORB_COUNT = 42
const GRAVITY = 0.06
const FRICTION = 0.996
const BOUNCE = 0.86

export default function PhysicsOrbField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let w = 0
    let h = 0
    let dpr = 1

    const mouse = { x: -9999, y: -9999, active: false }
    const ripples: Ripple[] = []

    const seed = (value: number) => {
      const x = Math.sin(value * 1345.456 + 0.2487) * 43758.5453123
      return x - Math.floor(x)
    }

    const orbs: Orb[] = Array.from({ length: ORB_COUNT }, (_, i) => {
      const r = 8 + seed(i + 1) * 16
      return {
        x: 80 + seed(i + 2) * 900,
        y: 40 + seed(i + 3) * 360,
        vx: (seed(i + 4) - 0.5) * 1.6,
        vy: (seed(i + 5) - 0.5) * 1.2,
        r,
        m: r * 0.2,
      }
    })

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const resolveCollision = (a: Orb, b: Orb) => {
      const dx = b.x - a.x
      const dy = b.y - a.y
      const dist = Math.hypot(dx, dy)
      const minDist = a.r + b.r
      if (!dist || dist >= minDist) return

      const nx = dx / dist
      const ny = dy / dist
      const overlap = (minDist - dist) * 0.5

      a.x -= nx * overlap
      a.y -= ny * overlap
      b.x += nx * overlap
      b.y += ny * overlap

      const kx = a.vx - b.vx
      const ky = a.vy - b.vy
      const p = (2 * (kx * nx + ky * ny)) / (a.m + b.m)

      a.vx -= p * b.m * nx
      a.vy -= p * b.m * ny
      b.vx += p * a.m * nx
      b.vy += p * a.m * ny
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      const bg = ctx.createRadialGradient(w * 0.25, h * 0.2, 20, w * 0.25, h * 0.2, w * 0.8)
      bg.addColorStop(0, 'rgba(248, 207, 221, 0.36)')
      bg.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)

      for (let i = 0; i < orbs.length; i++) {
        const o = orbs[i]
        o.vy += GRAVITY

        if (mouse.active) {
          const dx = o.x - mouse.x
          const dy = o.y - mouse.y
          const d2 = dx * dx + dy * dy
          const influence = 160
          if (d2 < influence * influence) {
            const force = (1 - d2 / (influence * influence)) * 0.55
            const n = Math.sqrt(d2) || 1
            o.vx += (dx / n) * force
            o.vy += (dy / n) * force
          }
        }

        for (let r = ripples.length - 1; r >= 0; r--) {
          const ripple = ripples[r]
          ripple.radius += 4
          ripple.strength *= 0.96
          const dx = o.x - ripple.x
          const dy = o.y - ripple.y
          const dist = Math.hypot(dx, dy)
          if (dist < ripple.radius + 25 && dist > ripple.radius - 25) {
            const n = dist || 1
            const pulse = ripple.strength * 0.85
            o.vx += (dx / n) * pulse
            o.vy += (dy / n) * pulse
          }
          if (ripple.strength < 0.04) ripples.splice(r, 1)
        }

        o.vx *= FRICTION
        o.vy *= FRICTION
        o.x += o.vx
        o.y += o.vy

        if (o.x - o.r < 0) {
          o.x = o.r
          o.vx *= -BOUNCE
        } else if (o.x + o.r > w) {
          o.x = w - o.r
          o.vx *= -BOUNCE
        }

        if (o.y - o.r < 0) {
          o.y = o.r
          o.vy *= -BOUNCE
        } else if (o.y + o.r > h) {
          o.y = h - o.r
          o.vy *= -BOUNCE
        }
      }

      for (let i = 0; i < orbs.length; i++) {
        for (let j = i + 1; j < orbs.length; j++) {
          resolveCollision(orbs[i], orbs[j])
        }
      }

      for (let i = 0; i < orbs.length; i++) {
        const o = orbs[i]
        const g = ctx.createRadialGradient(o.x - o.r * 0.35, o.y - o.r * 0.35, o.r * 0.2, o.x, o.y, o.r)
        g.addColorStop(0, 'rgba(255, 245, 249, 0.95)')
        g.addColorStop(1, 'rgba(214, 111, 148, 0.3)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2)
        ctx.fill()
      }

      for (let i = 0; i < ripples.length; i++) {
        const ripple = ripples[i]
        ctx.strokeStyle = `rgba(214,111,148,${Math.min(ripple.strength, 0.4)})`
        ctx.lineWidth = 1.4
        ctx.beginPath()
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2)
        ctx.stroke()
      }

      raf = requestAnimationFrame(draw)
    }

    const onMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = event.clientX - rect.left
      mouse.y = event.clientY - rect.top
      mouse.active = true
    }

    const onLeave = () => {
      mouse.active = false
      mouse.x = -9999
      mouse.y = -9999
    }

    const onClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      ripples.push({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        radius: 10,
        strength: 1,
      })
    }

    resize()
    draw()

    window.addEventListener('resize', resize)
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onLeave)
    canvas.addEventListener('click', onClick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onLeave)
      canvas.removeEventListener('click', onClick)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 -z-10 h-full w-full" aria-hidden="true" />
}
