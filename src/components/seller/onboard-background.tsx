"use client"

import { useEffect, useRef } from "react"

export function ConstellationBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let animationFrameId: number
        let particles: Particle[] = []

        class Particle {
            x: number
            y: number
            vx: number
            vy: number
            radius: number

            constructor(x: number, y: number) {
                this.x = x
                this.y = y
                this.vx = (Math.random() - 0.5) * 0.5
                this.vy = (Math.random() - 0.5) * 0.5
                this.radius = Math.random() * 2 + 1
            }

            update() {
                this.x += this.vx
                this.y += this.vy

                if (this.x < 0 || this.x > canvas!.width) this.vx *= -1
                if (this.y < 0 || this.y > canvas!.height) this.vy *= -1
            }

            draw() {
                ctx!.beginPath()
                ctx!.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
                ctx!.fillStyle = "rgba(139, 92, 246, 0.6)" // primary color
                ctx!.fill()
            }
        }

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            initParticles()
        }

        const initParticles = () => {
            particles = []
            const particleCount = Math.floor((canvas.width * canvas.height) / 15000)
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height))
            }
        }

        const drawConnections = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x
                    const dy = particles[i].y - particles[j].y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (distance < 150) {
                        ctx.beginPath()
                        ctx.strokeStyle = `rgba(139, 92, 246, ${0.2 * (1 - distance / 150)})`
                        ctx.lineWidth = 1
                        ctx.moveTo(particles[i].x, particles[i].y)
                        ctx.lineTo(particles[j].x, particles[j].y)
                        ctx.stroke()
                    }
                }
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            particles.forEach((particle) => {
                particle.update()
                particle.draw()
            })

            drawConnections()

            animationFrameId = requestAnimationFrame(animate)
        }

        resize()
        window.addEventListener("resize", resize)
        animate()

        return () => {
            window.removeEventListener("resize", resize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-30" />
}
