import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '특전바로가기',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
