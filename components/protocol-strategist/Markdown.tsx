'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { wcg } from './wcgTheme'

/**
 * Assistant-message renderer. The system prompt asks the model for bullets and
 * comparison tables, so the chat needs a real markdown pass — raw `**` and
 * pipe tables read as broken output. react-markdown renders to React elements
 * (no innerHTML), so model-authored text stays inert.
 */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="text-[14.5px] leading-relaxed space-y-2.5" style={{ color: wcg.body }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p>{children}</p>,
          strong: ({ children }) => (
            <strong className="font-semibold" style={{ color: wcg.ink }}>
              {children}
            </strong>
          ),
          ul: ({ children }) => <ul className="list-disc pl-5 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="leading-snug">{children}</li>,
          h1: ({ children }) => <Heading>{children}</Heading>,
          h2: ({ children }) => <Heading>{children}</Heading>,
          h3: ({ children }) => <Heading>{children}</Heading>,
          h4: ({ children }) => <Heading>{children}</Heading>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
              style={{ color: wcg.blue }}
            >
              {children}
            </a>
          ),
          code: ({ children }) => (
            <code
              className="rounded px-1 py-0.5 text-[13px]"
              style={{ background: wcg.surfaceMuted, color: wcg.ink }}
            >
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre
              className="rounded-lg border p-3 text-[12.5px] overflow-x-auto"
              style={{ background: wcg.surfaceMuted, borderColor: wcg.border }}
            >
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 pl-3" style={{ borderColor: wcg.borderStrong, color: wcg.muted }}>
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[13px]">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th
              className="border px-2.5 py-1.5 text-left font-semibold"
              style={{ borderColor: wcg.border, background: wcg.surfaceMuted, color: wcg.ink }}
            >
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border px-2.5 py-1.5 align-top" style={{ borderColor: wcg.border }}>
              {children}
            </td>
          ),
          hr: () => <hr className="border-0 border-t" style={{ borderColor: wcg.border }} />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[14.5px] font-semibold mt-1" style={{ color: wcg.ink }}>
      {children}
    </p>
  )
}
