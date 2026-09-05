import React from 'react'
import { workDisclaimer } from '@/data/work'

export default function WorkDisclaimer({ className = '' }: { className?: string }) {
  return (
    <p className={`text-xs text-zinc leading-relaxed max-w-3xl ${className}`}>
      {workDisclaimer}
    </p>
  )
}
