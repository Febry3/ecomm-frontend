"use client"

import { useEffect, useRef, useState } from "react"

export function CursorEye() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [pupilPosition, setPupilPosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return

            const container = containerRef.current
            const rect = container.getBoundingClientRect()
            const containerCenterX = rect.left + rect.width / 2
            const containerCenterY = rect.top + rect.height / 2

            const angle = Math.atan2(e.clientY - containerCenterY, e.clientX - containerCenterX)
            const distance = 12

            const pupilX = Math.cos(angle) * distance
            const pupilY = Math.sin(angle) * distance

            setPupilPosition({ x: pupilX, y: pupilY })
        }

        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [])

    const Eye = () => (
        <div className="relative w-16 h-14 flex items-center justify-center">
            {/* Eye white */}
            <div className="absolute w-14 h-16 bg-white rounded-full shadow-md" />

            {/* Iris */}
            <div
                className="absolute w-6 h-8 bg-linear-to-br from-blue-500 to-blue-700 rounded-full transition-transform duration-75 ease-out"
                style={{
                    transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
                }}
            >
                {/* Pupil */}
                <div className="absolute inset-2 bg-black rounded-full" />

                {/* Shine/Highlight */}
                <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-80" />
            </div>
        </div>
    )

    return (
        <div ref={containerRef} className="inline-flex items-center justify-center">
            <Eye />
            <Eye />
        </div>
    )
}
