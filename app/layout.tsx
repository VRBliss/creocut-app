import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CreoCut - AI Video Analysis for Maximum Retention',
  description: 'Get AI-powered feedback on your video edits to boost retention and engagement',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  )
}
