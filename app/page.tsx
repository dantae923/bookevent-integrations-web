"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RootRedirect() {
  const router = useRouter()

  useEffect(() => {
    const isMobileUserAgent = /iPhone|Android|Mobile/i.test(navigator.userAgent)
    const isSmallViewport = window.innerWidth <= 768
    const isMobile = isMobileUserAgent || isSmallViewport

    if (isMobile) {
      router.replace("/mobile")
    } else {
      router.replace("/integrations")
    }
  }, [router])

  return null
}
