// app/page.tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RootRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent)
    router.replace(isMobile ? "/mobile" : "/integrations")
  }, [router])

  return (
    <div style={{ padding: "3rem", textAlign: "center", color: "#888" }}>
      이동 중입니다...
    </div>
  )
}
