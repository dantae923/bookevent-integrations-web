"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RootRedirect() {
  const router = useRouter()

  useEffect(() => {
    const isMobile = /iPhone|Android|Mobile/i.test(navigator.userAgent)
    if (isMobile) {
      router.replace("/mobile")
    } else {
      router.replace("/integrations")
    }
  }, [router])

  return null
}
