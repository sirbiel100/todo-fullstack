"use client"
import { useEffect, useState } from "react"

export default function CheckWindowWidth(): number {

    if (typeof window === 'undefined') return 0

    const [windowWidth, setWindowWidth] = useState<number>(window?.innerWidth);


    useEffect(() => {

        const handleResize = () => setWindowWidth(window.innerWidth)

        window.addEventListener('resize', handleResize)
        window.addEventListener('load', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [windowWidth])

    return windowWidth
}