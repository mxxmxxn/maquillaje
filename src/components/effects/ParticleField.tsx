import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 120
const OFFSCREEN_MOUSE = 10

const vertexShader = `
  attribute float aSize;
  attribute float aOpacity;
  attribute float aPhase;
  attribute float aPhaseSecondary;
  attribute float aDrift;
  attribute float aWander;

  uniform float uTime;
  uniform vec2 uMouse;

  varying float vAlpha;

  void main() {
    vec3 transformed = position;
    float time = uTime * aDrift;

    transformed.x += sin(time * 0.22 + aPhase) * aWander;
    transformed.x += cos(time * 0.16 + aPhaseSecondary) * aWander * 0.45;
    transformed.y += cos(time * 0.2 + aPhaseSecondary + position.x * 0.18) * aWander * 0.8;
    transformed.y += sin(time * 0.14 + aPhase) * aWander * 0.35;
    transformed.z += sin(time * 0.18 + aPhaseSecondary * 0.7) * 0.07;

    vec2 toParticle = transformed.xy - uMouse;
    float distanceToMouse = length(toParticle);
    float repelStrength = smoothstep(1.45, 0.18, distanceToMouse);

    if (distanceToMouse > 0.0001) {
      transformed.xy += normalize(toParticle) * repelStrength * 0.22;
    }

    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = aSize * (338.0 / -mvPosition.z);

    float depthFade = smoothstep(7.5, 3.0, -mvPosition.z);
    vAlpha = aOpacity * (1.08 + repelStrength * 0.1) * depthFade;
  }
`

const fragmentShader = `
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));

    if (d > 0.5) {
      discard;
    }

    float alpha = smoothstep(0.5, 0.1, d) * vAlpha;

    gl_FragColor = vec4(0.88, 0.72, 0.78, alpha);
  }
`

function BeautyParticles({ targetMouse, currentMouse }: { targetMouse: React.MutableRefObject<THREE.Vector2>; currentMouse: React.MutableRefObject<THREE.Vector2> }) {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(OFFSCREEN_MOUSE, OFFSCREEN_MOUSE) },
    }),
    [],
  )

  const attributes = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const sizes = new Float32Array(PARTICLE_COUNT)
    const opacities = new Float32Array(PARTICLE_COUNT)
    const phases = new Float32Array(PARTICLE_COUNT)
    const secondaryPhases = new Float32Array(PARTICLE_COUNT)
    const drifts = new Float32Array(PARTICLE_COUNT)
    const wander = new Float32Array(PARTICLE_COUNT)

    const sampleSpreadPosition = (placedCount: number) => {
      for (let attempt = 0; attempt < 28; attempt += 1) {
        const candidate = new THREE.Vector3(
          THREE.MathUtils.randFloatSpread(9.4),
          THREE.MathUtils.randFloatSpread(6.6),
          THREE.MathUtils.randFloatSpread(3.1),
        )

        let tooClose = false

        for (let previousIndex = 0; previousIndex < placedCount; previousIndex += 1) {
          const previousStride = previousIndex * 3

          const dx = candidate.x - positions[previousStride]
          const dy = candidate.y - positions[previousStride + 1]
          const dz = (candidate.z - positions[previousStride + 2]) * 1.4

          if (dx * dx + dy * dy + dz * dz < 0.72 * 0.72) {
            tooClose = true
            break
          }
        }

        if (!tooClose) {
          return candidate
        }
      }

      return new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(9.4),
        THREE.MathUtils.randFloatSpread(6.6),
        THREE.MathUtils.randFloatSpread(3.1),
      )
    }

    for (let index = 0; index < PARTICLE_COUNT; index += 1) {
      const stride = index * 3
      const position = sampleSpreadPosition(index)

      positions[stride] = position.x
      positions[stride + 1] = position.y
      positions[stride + 2] = position.z
      sizes[index] = THREE.MathUtils.randFloat(1, 5)
      opacities[index] = THREE.MathUtils.randFloat(0.1, 0.6)
      phases[index] = THREE.MathUtils.randFloat(0, Math.PI * 2)
      secondaryPhases[index] = THREE.MathUtils.randFloat(0, Math.PI * 2)
      drifts[index] = THREE.MathUtils.randFloat(0.65, 1)
      wander[index] = THREE.MathUtils.randFloat(0.24, 0.56)
    }

    return { positions, sizes, opacities, phases, secondaryPhases, drifts, wander }
  }, [])

  useFrame(({ clock, viewport }) => {
    currentMouse.current.lerp(targetMouse.current, 0.08)

    if (!materialRef.current) {
      return
    }

    materialRef.current.uniforms.uTime.value = clock.getElapsedTime()
    materialRef.current.uniforms.uMouse.value.set(
      currentMouse.current.x * viewport.width * 0.5,
      currentMouse.current.y * viewport.height * 0.5,
    )
  })

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[attributes.positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[attributes.sizes, 1]} />
        <bufferAttribute attach="attributes-aOpacity" args={[attributes.opacities, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[attributes.phases, 1]} />
        <bufferAttribute attach="attributes-aPhaseSecondary" args={[attributes.secondaryPhases, 1]} />
        <bufferAttribute attach="attributes-aDrift" args={[attributes.drifts, 1]} />
        <bufferAttribute attach="attributes-aWander" args={[attributes.wander, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default function ParticleField() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const targetMouse = useRef(new THREE.Vector2(OFFSCREEN_MOUSE, OFFSCREEN_MOUSE))
  const currentMouse = useRef(new THREE.Vector2(OFFSCREEN_MOUSE, OFFSCREEN_MOUSE))

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const rect = containerRef.current?.getBoundingClientRect()

      if (!rect) {
        return
      }

      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom

      if (!inside) {
        targetMouse.current.set(OFFSCREEN_MOUSE, OFFSCREEN_MOUSE)
        return
      }

      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1)
      targetMouse.current.set(x, y)
    }

    const resetPointer = () => {
      targetMouse.current.set(OFFSCREEN_MOUSE, OFFSCREEN_MOUSE)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerleave', resetPointer)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', resetPointer)
    }
  }, [])

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 z-20">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        className="h-full w-full"
      >
        <BeautyParticles targetMouse={targetMouse} currentMouse={currentMouse} />
      </Canvas>
    </div>
  )
}
