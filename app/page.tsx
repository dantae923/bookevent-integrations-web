"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RootRedirect() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ua = navigator.userAgent
      alert("📱 userAgent: " + navigator.userAgent)

      const isMobileUA = /iPhone|Android|Mobile/i.test(ua)
      const isSmallWidth = window.innerWidth <= 768
      const isMobileData = (navigator as any).userAgentData?.mobile === true

      const isMobile = isMobileUA || isMobileData || isSmallWidth

      const currentPath = window.location.pathname

      if (isMobile && currentPath !== "/mobile") {
        router.replace("/mobile")
      } else if (!isMobile && currentPath !== "/integrations") {
        router.replace("/integrations")
      }
    }
  }, [router])

  return null
}
