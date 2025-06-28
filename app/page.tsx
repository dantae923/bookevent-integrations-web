"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RootRedirect() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ua = navigator.userAgent
      const isMobile = /iPhone|Android|Mobile/i.test(ua)

      if (isMobile) {
        router.replace("/mobile")
      } else {
        router.replace("/integrations")
      }
    }
  }, [router])

  return null
}
