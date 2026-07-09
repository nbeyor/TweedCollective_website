import React from 'react'
import { ChevronRight } from 'lucide-react'
import { CONTACT_EMAIL } from '@/lib/site'

interface EmailCTAProps {
  label?: string
  variant?: 'primary' | 'outline'
  align?: 'center' | 'left'
  className?: string
}

export default function EmailCTA({
  label = 'Get in touch',
  variant = 'primary',
  align = 'center',
  className = '',
}: EmailCTAProps) {
  const alignClass = align === 'center' ? 'items-center text-center' : 'items-start text-left'
  const buttonClass = variant === 'primary' ? 'btn-primary' : 'btn-outline'

  return (
    <div className={`flex flex-col gap-3 ${alignClass} ${className}`}>
      <a href={`mailto:${CONTACT_EMAIL}`} className={`${buttonClass} text-base px-8 py-4 group`}>
        <span>{label}</span>
        <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
      </a>
      <span className="font-mono text-sm text-stone select-all">{CONTACT_EMAIL}</span>
    </div>
  )
}
