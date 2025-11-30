"use client"

import { useEffect, useRef } from "react"

export function FloatingParticles() {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const particleCount = 20
        const particles: HTMLDivElement[] = []

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement("div")
            particle.className = "absolute rounded-full pointer-events-none"

            const size = Math.random() * 6 + 2
            particle.style.width = `${size}px`
            particle.style.height = `${size}px`

            const isCyan = Math.random() > 0.5
            particle.style.backgroundColor = isCyan ? "rgba(6, 182, 212, 0.6)" : "rgba(139, 92, 246, 0.6)"

            particle.style.left = `${Math.random() * 100}%`
            particle.style.top = `${Math.random() * 100}%`

            const duration = Math.random() * 10 + 15
            const delay = Math.random() * 5
            particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`

            container.appendChild(particle)
            particles.push(particle)
        }

        return () => {
            particles.forEach((particle) => particle.remove())
        }
    }, [])

    return <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden" />
}
