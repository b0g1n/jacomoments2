import { useRef, useEffect, useState } from 'react'

interface Use3DTiltOptions {
  maxTilt?: number
  perspective?: number
  scale?: number
  speed?: number
  easing?: number
  glare?: boolean
  glareMaxOpacity?: number
}

interface TiltValues {
  transform: string
  glareStyle: React.CSSProperties
}

export function use3DTilt(options: Use3DTiltOptions = {}) {
  const {
    maxTilt = 15,
    perspective = 1000,
    scale = 1.02,
    speed = 300,
    easing = 15,
    glare = true,
    glareMaxOpacity = 0.15,
  } = options

  const ref = useRef<HTMLDivElement>(null)
  const [tiltValues, setTiltValues] = useState<TiltValues>({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
    glareStyle: {
      opacity: 0,
      background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)',
    },
  })

  const [currentX, setCurrentX] = useState(0)
  const [currentY, setCurrentY] = useState(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    let requestFrameId: number
    let targetX = 0
    let targetY = 0
    let glareX = 50
    let glareY = 50

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const mouseX = e.clientX - centerX
      const mouseY = e.clientY - centerY

      targetX = (mouseY / (rect.height / 2)) * -maxTilt
      targetY = (mouseX / (rect.width / 2)) * maxTilt

      glareX = (e.clientX - rect.left) / rect.width * 100
      glareY = (e.clientY - rect.top) / rect.height * 100

      if (!requestFrameId) {
        requestFrameId = requestAnimationFrame(updateTilt)
      }
    }

    const updateTilt = () => {
      const nextX = currentX + (targetX - currentX) / easing
      const nextY = currentY + (targetY - currentY) / easing

      setCurrentX(nextX)
      setCurrentY(nextY)

      const transform = `perspective(${perspective}px) rotateX(${nextX}deg) rotateY(${nextY}deg) scale(${scale})`

      const glareStyle: React.CSSProperties = glare ? {
        opacity: (Math.abs(nextX) + Math.abs(nextY)) / (maxTilt * 2) * glareMaxOpacity,
        background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)`,
      } : { opacity: 0 }

      setTiltValues({ transform, glareStyle })

      const delta = Math.abs(targetX - nextX) + Math.abs(targetY - nextY)
      if (delta > 0.1) {
        requestFrameId = requestAnimationFrame(updateTilt)
      } else {
        requestFrameId = 0
      }
    }

    const handleMouseLeave = () => {
      targetX = 0
      targetY = 0

      if (!requestFrameId) {
        requestFrameId = requestAnimationFrame(updateTilt)
      }

      setTimeout(() => {
        setTiltValues({
          transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`,
          glareStyle: { opacity: 0 },
        })
        setCurrentX(0)
        setCurrentY(0)
      }, speed)
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
      if (requestFrameId) {
        cancelAnimationFrame(requestFrameId)
      }
    }
  }, [currentX, currentY, maxTilt, perspective, scale, speed, easing, glare, glareMaxOpacity])

  return { ref, tiltValues }
}
