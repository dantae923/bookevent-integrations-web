"use client"

import { useEffect } from "react"

export default function RootRedirect() {
  useEffect(() => {
    const isMobile = /iPhone|Android|Mobile/i.test(navigator.userAgent)
    if (typeof window !== "undefined") {
      if (isMobile) {
        window.location.replace("/mobile")
      } else {
        window.location.replace("/integrations")
      }
    }
  }, [])

  return null
}
