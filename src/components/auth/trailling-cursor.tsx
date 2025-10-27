"use client"

import { useEffect, useRef } from "react"
import useFluidCursor from "./useFluidCursor"

export function TrailingCursor() {
    useEffect(() => {
        useFluidCursor()
    }, [])

    return <div className='fixed top-0 left-0 z-2'>
        <canvas id='fluid' className='w-screen h-screen' />
    </div>
}


