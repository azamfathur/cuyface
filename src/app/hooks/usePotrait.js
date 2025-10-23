import { useState, useEffect } from 'react'

export function usePotrait() {
    const [potrait, setPotrait] = useState(false);

    useEffect(() => {
        if(typeof window === "undefined") return;

        const screenMedia = window.matchMedia("(orientation: portrait)")

        const onChange = () => setPotrait(screenMedia.matches)
        onChange()
        
        screenMedia.addEventListener?.("change", onChange);
        return () => screenMedia.removeEventListener?.("change", onChange)
    }, [])

    return potrait
}