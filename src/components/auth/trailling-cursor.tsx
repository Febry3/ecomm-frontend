"use client"

import { useEffect, useRef } from "react"

export function TrailingCursor() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const trailRef = useRef<Array<{ x: number; y: number; hue: number }>>([])
    const mouseXRef = useRef(0)
    const mouseYRef = useRef(0)
    const hueRef = useRef(0)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resizeCanvas()
        window.addEventListener("resize", resizeCanvas)

        const handleMouseMove = (e: MouseEvent) => {
            mouseXRef.current = e.clientX
            mouseYRef.current = e.clientY

            trailRef.current.push({
                x: mouseXRef.current,
                y: mouseYRef.current,
                hue: hueRef.current,
            })

            // Keep trail length manageable
            if (trailRef.current.length > 50) {
                trailRef.current.shift()
            }

            hueRef.current = (hueRef.current + 8) % 360
        }

        window.addEventListener("mousemove", handleMouseMove)

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            if (trailRef.current.length > 1) {
                for (let i = 0; i < trailRef.current.length - 1; i++) {
                    const current = trailRef.current[i]
                    const next = trailRef.current[i + 1]
                    const progress = i / trailRef.current.length

                    // Create gradient for smooth fade
                    const gradient = ctx.createLinearGradient(current.x, current.y, next.x, next.y)
                    const opacity = progress * 0.8
                    gradient.addColorStop(0, `hsla(${current.hue}, 100%, 55%, ${opacity})`)
                    gradient.addColorStop(1, `hsla(${next.hue}, 100%, 55%, ${opacity * 0.5})`)

                    ctx.strokeStyle = gradient
                    ctx.lineWidth = 8 * (1 - progress)
                    ctx.lineCap = "round"
                    ctx.lineJoin = "round"

                    ctx.beginPath()
                    ctx.moveTo(current.x, current.y)
                    ctx.lineTo(next.x, next.y)
                    ctx.stroke()
                }

                const head = trailRef.current[trailRef.current.length - 1]
                const headGradient = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 12)
                headGradient.addColorStop(0, `hsla(${head.hue}, 100%, 70%, 1)`)
                headGradient.addColorStop(1, `hsla(${head.hue}, 100%, 55%, 0.3)`)

                ctx.fillStyle = headGradient
                ctx.beginPath()
                ctx.arc(head.x, head.y, 12, 0, Math.PI * 2)
                ctx.fill()
            }

            requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("resize", resizeCanvas)
        }
    }, [])

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 40 }} />
}
