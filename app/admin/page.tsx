'use client'

import React, { useState, useEffect } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import { Shield, Users, FileText, Check, X, RefreshCw, ChevronDown, ChevronUp, Mail, Link2, Copy, Trash2, Clock, Sparkles } from 'lucide-react'
import Link from 'next/link'

interface UserWithAccess {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  documentAccess: string[]
  createdAt: string
  grantInfo?: Record<string, { method: 'bulk-email' | 'magic-link' | 'manual', timestamp: string }>
}

interface MagicLink {
  token: string
  documentId: string
  createdAt: string
  usedAt?: string
  usedBy?: string
  expiresAt?: string
  status: 'active' | 'used' | 'expired'
}

interface AuditEntry {
  userId: string
  email: string
  documentIds: string[]
  timestamp: string
  method: 'bulk-email' | 'magic-link'
}

// List of available documents
const DOCUMENTS = [
  { id: 'vibe-coding-in-enterprise-for-pe', title: 'VIBE Coding in Enterprise' },
  { id: 'health-tech-market-2024', title: 'Health-Tech Market Landscape' },
  { id: 'ai-integration-framework', title: 'AI Integration Framework' },
  { id: 'salmon-ai-genomics', title: 'Strategic AI for Salmon Genomics' },
]

export default function AdminPage() {
  const { userId, isLoaded } = useAuth()
  const { user } = useUser()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [users, setUsers] = useState<UserWithAccess[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedUser, setExpandedUser] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)
  const [testingEmail, setTestingEmail] = useState(false)
  const [emailTestResult, setEmailTestResult] = useState<string | null>(null)
  const [expandedDocument, setExpandedDocument] = useState<string | null>(null)
  const [bulkEmails, setBulkEmails] = useState<Record<string, string>>({})
  const [savingEmails, setSavingEmails] = useState<Record<string, boolean>>({})
  const [approvedEmails, setApprovedEmails] = useState<Record<string, string[]>>({})
  const [magicLinks, setMagicLinks] = useState<MagicLink[]>([])
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([])
  const [expandedMagicLink, setExpandedMagicLink] = useState<string | null>(null)
  const [generatingLink, setGeneratingLink] = useState<Record<string, boolean>>({})
  const [testEmailInput, setTestEmailInput] = useState('')
  const [testingAutoGrant, setTestingAutoGrant] = useState(false)

  // Check if current user is admin
  useEffect(() => {
    async function checkAdmin() {
      if (!isLoaded || !userId) {
        setIsAdmin(false)
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/admin/check')
        const data = await response.json()
        setIsAdmin(data.isAdmin)
        
        if (data.isAdmin) {
          fetchUsers()
          fetchApprovedEmails()
          fetchMagicLinks()
          fetchAuditTrail()
        } else {
          setLoading(false)
        }
      } catch (err) {
        setIsAdmin(false)
        setLoading(false)
      }
    }

    checkAdmin()
  }, [userId, isLoaded])

  async function fetchUsers() {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
      } else {
        setUsers(data.users || [])
      }
    } catch (err) {
      setError('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  async function fetchApprovedEmails() {
    try {
      const emails: Record<string, string[]> = {}
      for (const doc of DOCUMENTS) {
        const response = await fetch(`/api/admin/approved-emails?documentId=${doc.id}`)
        const data = await response.json()
        emails[doc.id] = data.approvedEmails || []
      }
      setApprovedEmails(emails)
    } catch (err) {
      console.error('Failed to fetch approved emails:', err)
    }
  }

  async function fetchMagicLinks() {
    try {
      const response = await fetch('/api/admin/magic-links')
      const data = await response.json()
      if (data.magicLinks) {
        setMagicLinks(data.magicLinks)
      }
    } catch (err) {
      console.error('Failed to fetch magic links:', err)
    }
  }

  async function fetchAuditTrail() {
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      if (data.auditTrail) {
        setAuditTrail(data.auditTrail)
      }
    } catch (err) {
      console.error('Failed to fetch audit trail:', err)
    }
  }

  async function generateMagicLink(documentId: string) {
    setGeneratingLink({ ...generatingLink, [documentId]: true })
    try {
      const response = await fetch('/api/admin/magic-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, expiresInDays: 30 })
      })
      
      const data = await response.json()
      
      if (data.success) {
        await fetchMagicLinks()
        // Copy to clipboard
        await navigator.clipboard.writeText(data.magicLinkUrl)
        setError(null)
        alert(`Magic link generated and copied to clipboard!\n\n${data.magicLinkUrl}`)
      } else {
        setError(data.error || 'Failed to generate magic link')
      }
    } catch (err) {
      setError('Failed to generate magic link')
    } finally {
      setGeneratingLink({ ...generatingLink, [documentId]: false })
    }
  }

  async function revokeMagicLink(token: string) {
    try {
      const response = await fetch('/api/admin/magic-links', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })
      
      const data = await response.json()
      
      if (data.success) {
        await fetchMagicLinks()
        setError(null)
      } else {
        setError(data.error || 'Failed to revoke magic link')
      }
    } catch (err) {
      setError('Failed to revoke magic link')
    }
  }

  async function copyMagicLink(url: string) {
    try {
      await navigator.clipboard.writeText(url)
      alert('Magic link copied to clipboard!')
    } catch (err) {
      setError('Failed to copy magic link')
    }
  }

  async function testAutoGrant() {
    if (!testEmailInput.trim()) {
      setError('Please enter an email address')
      return
    }

    setTestingAutoGrant(true)
    try {
      // Simulate what the webhook would do - check if email is in approved list
      const emailLower = testEmailInput.trim().toLowerCase()
      const matchingDocs: string[] = []
      
      for (const [docId, emails] of Object.entries(approvedEmails)) {
        if (emails.includes(emailLower)) {
          matchingDocs.push(docId)
        }
      }
      
      if (matchingDocs.length > 0) {
        const docTitles = matchingDocs.map(id => DOCUMENTS.find(d => d.id === id)?.title || id).join(', ')
        setEmailTestResult(`✅ Email "${testEmailInput}" would be auto-granted access to: ${docTitles}`)
      } else {
        setEmailTestResult(`ℹ️ Email "${testEmailInput}" is not in any approved email lists`)
      }
    } catch (err: any) {
      setEmailTestResult(`❌ Error: ${err.message}`)
    } finally {
      setTestingAutoGrant(false)
    }
  }

  async function saveBulkEmails(documentId: string) {
    setSavingEmails({ ...savingEmails, [documentId]: true })
    
    try {
      const emailText = bulkEmails[documentId] || ''
      const emailList = emailText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
      
      const response = await fetch('/api/admin/approved-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId,
          emails: emailList
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setApprovedEmails({ ...approvedEmails, [documentId]: data.approvedEmails })
        setBulkEmails({ ...bulkEmails, [documentId]: '' })
        setError(null)
        // Refresh users to show newly granted access
        fetchUsers()
      } else {
        setError(data.error || 'Failed to save approved emails')
      }
    } catch (err) {
      setError('Failed to save approved emails')
    } finally {
      setSavingEmails({ ...savingEmails, [documentId]: false })
    }
  }

  async function toggleAccess(targetUserId: string, documentId: string, currentlyHasAccess: boolean) {
    setUpdating(`${targetUserId}-${documentId}`)
    
    try {
      const response = await fetch('/api/admin/update-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: targetUserId,
          documentId,
          action: currentlyHasAccess ? 'revoke' : 'grant'
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Update local state
        setUsers(users.map(u => {
          if (u.id === targetUserId) {
            return {
              ...u,
              documentAccess: currentlyHasAccess
                ? u.documentAccess.filter(d => d !== documentId)
                : [...u.documentAccess, documentId]
            }
          }
          return u
        }))
      } else {
        setError(data.error || 'Failed to update access')
      }
    } catch (err) {
      setError('Failed to update access')
    } finally {
      setUpdating(null)
    }
  }

  async function testEmail() {
    setTestingEmail(true)
    setEmailTestResult(null)
    
    try {
      const response = await fetch('/api/test-email', {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (data.success) {
        const note = data.note ? ` ${data.note}` : ''
        const emails = data.adminEmails ? ` (${data.adminEmails.join(', ')})` : ''
        setEmailTestResult(`✅ Test email sent successfully to Admin${emails}! Email ID: ${data.emailId || 'unknown'}.${note}`)
      } else {
        const details = data.details ? ` Details: ${data.details}` : ''
        setEmailTestResult(`❌ Error: ${data.error || 'Unknown error'}${details}`)
      }
    } catch (err: any) {
      setEmailTestResult(`❌ Failed to send test email: ${err.message}`)
    } finally {
      setTestingEmail(false)
    }
  }

  // Not loaded yet
  if (!isLoaded || isAdmin === null) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-sage/30 border-t-sage rounded-full animate-spin"></div>
      </div>
    )
  }

  // Not signed in
  if (!userId) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-xl border border-stone/30 bg-white text-center">
          <Shield className="w-16 h-16 mx-auto mb-6 text-warm-gray" />
          <h1 className="text-2xl font-serif text-charcoal mb-2">Admin Access Required</h1>
          <p className="text-warm-gray mb-6">Please sign in with an admin account to access this page.</p>
          <Link href="/sign-in" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-xl border border-stone/30 bg-white text-center">
          <Shield className="w-16 h-16 mx-auto mb-6 text-red-400" />
          <h1 className="text-2xl font-serif text-charcoal mb-2">Access Denied</h1>
          <p className="text-warm-gray mb-6">
            You don't have admin privileges. Contact the site administrator if you believe this is an error.
          </p>
          <Link href="/" className="btn-outline">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream pt-28 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-serif text-charcoal mb-2">Admin Dashboard</h1>
              <p className="text-warm-gray">Manage user document access</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={testEmail}
                disabled={testingEmail}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sage text-cream hover:bg-sage-light disabled:opacity-50 transition-colors"
              >
                <Mail className={`w-4 h-4 ${testingEmail ? 'animate-pulse' : ''}`} />
                {testingEmail ? 'Sending...' : 'Test Email'}
              </button>
              <button
                onClick={fetchUsers}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sage text-cream hover:bg-sage/90 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          {emailTestResult && (
            <div className={`mb-6 p-4 rounded-lg border ${
              emailTestResult.startsWith('✅') 
                ? 'bg-green-50 border-green-200 text-green-700' 
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              {emailTestResult}
              <button onClick={() => setEmailTestResult(null)} className="ml-4 underline">Dismiss</button>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
              {error}
              <button onClick={() => setError(null)} className="ml-4 underline">Dismiss</button>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-white border border-stone/30">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-sage" />
                <div>
                  <p className="text-2xl font-bold text-charcoal">{users.length}</p>
                  <p className="text-sm text-warm-gray">Total Users</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-stone/30">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold text-charcoal">{DOCUMENTS.length}</p>
                  <p className="text-sm text-warm-gray">Documents</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-stone/30">
              <div className="flex items-center gap-3">
                <Check className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-charcoal">
                    {users.filter(u => u.documentAccess.length > 0).length}
                  </p>
                  <p className="text-sm text-warm-gray">With Access</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-stone/30">
              <div className="flex items-center gap-3">
                <X className="w-8 h-8 text-red-400" />
                <div>
                  <p className="text-2xl font-bold text-charcoal">
                    {users.filter(u => u.documentAccess.length === 0).length}
                  </p>
                  <p className="text-sm text-warm-gray">No Access</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bulk Email Management */}
          <div className="bg-white rounded-xl border border-stone/30 overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-stone/20 bg-stone/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-charcoal">Bulk Email Approval</h2>
                  <p className="text-sm text-warm-gray mt-1">Add email addresses that should automatically get access when they sign up</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    value={testEmailInput}
                    onChange={(e) => setTestEmailInput(e.target.value)}
                    placeholder="test@example.com"
                    className="px-3 py-1.5 rounded-lg border border-stone/30 text-sm text-charcoal focus:outline-none focus:border-sage"
                    onKeyPress={(e) => e.key === 'Enter' && testAutoGrant()}
                  />
                  <button
                    onClick={testAutoGrant}
                    disabled={testingAutoGrant || !testEmailInput.trim()}
                    className="px-3 py-1.5 rounded-lg bg-sage text-cream hover:bg-sage-light disabled:opacity-50 transition-colors text-sm font-medium"
                  >
                    {testingAutoGrant ? 'Testing...' : 'Test'}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="divide-y divide-stone/20">
              {DOCUMENTS.map((doc) => (
                <div key={doc.id} className="px-6 py-4">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setExpandedDocument(expandedDocument === doc.id ? null : doc.id)}
                  >
                    <div>
                      <h3 className="font-medium text-charcoal">{doc.title}</h3>
                      <p className="text-sm text-warm-gray">
                        {approvedEmails[doc.id]?.length || 0} approved email{approvedEmails[doc.id]?.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    {expandedDocument === doc.id ? (
                      <ChevronUp className="w-5 h-5 text-warm-gray" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-warm-gray" />
                    )}
                  </div>
                  
                  {expandedDocument === doc.id && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">
                          Email addresses (one per line)
                        </label>
                        <textarea
                          value={bulkEmails[doc.id] || approvedEmails[doc.id]?.join('\n') || ''}
                          onChange={(e) => setBulkEmails({ ...bulkEmails, [doc.id]: e.target.value })}
                          placeholder="user1@example.com&#10;user2@example.com&#10;user3@example.com"
                          className="w-full h-32 px-4 py-3 rounded-lg border border-stone/30 bg-white text-charcoal font-mono text-sm resize-none focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20"
                        />
                        <p className="text-xs text-warm-gray mt-2">
                          Paste email addresses separated by newlines. These users will automatically get access when they sign up.
                        </p>
                      </div>
                      
                      {approvedEmails[doc.id] && approvedEmails[doc.id].length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-charcoal mb-2">
                            Currently approved ({approvedEmails[doc.id].length}):
                          </p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {approvedEmails[doc.id].map((email, idx) => (
                              <span key={idx} className="px-2 py-1 rounded bg-sage/10 text-sage text-xs font-mono">
                                {email}
                              </span>
                            ))}
                          </div>
                          {/* Show recent auto-grants for this document */}
                          {auditTrail.filter(e => 
                            e.documentIds.includes(doc.id) && e.method === 'bulk-email'
                          ).slice(-5).length > 0 && (
                            <div className="mt-3 pt-3 border-t border-stone/20">
                              <p className="text-xs font-medium text-charcoal mb-2">Recent auto-grants:</p>
                              <div className="space-y-1">
                                {auditTrail
                                  .filter(e => e.documentIds.includes(doc.id) && e.method === 'bulk-email')
                                  .slice(-5)
                                  .reverse()
                                  .map((entry, idx) => (
                                    <div key={idx} className="text-xs text-warm-gray flex items-center gap-2">
                                      <Clock className="w-3 h-3" />
                                      <span className="font-mono">{entry.email}</span>
                                      <span className="text-zinc">
                                        {new Date(entry.timestamp).toLocaleDateString()} {new Date(entry.timestamp).toLocaleTimeString()}
                                      </span>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <button
                        onClick={() => saveBulkEmails(doc.id)}
                        disabled={savingEmails[doc.id]}
                        className="px-4 py-2 rounded-lg bg-sage text-cream hover:bg-sage-light disabled:opacity-50 transition-colors text-sm font-medium"
                      >
                        {savingEmails[doc.id] ? 'Saving...' : 'Save Approved Emails'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Magic Links Management */}
          <div className="bg-white rounded-xl border border-stone/30 overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-stone/20 bg-stone/10">
              <h2 className="text-lg font-semibold text-charcoal">Magic Links</h2>
              <p className="text-sm text-warm-gray mt-1">Generate one-time share links that auto-grant access after signup</p>
            </div>
            
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {DOCUMENTS.map((doc) => (
                  <div key={doc.id} className="p-4 rounded-lg border border-stone/20 bg-stone/5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-charcoal text-sm">{doc.title}</h3>
                      <button
                        onClick={() => generateMagicLink(doc.id)}
                        disabled={generatingLink[doc.id]}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gold text-void hover:bg-gold-light disabled:opacity-50 transition-colors text-xs font-medium"
                      >
                        <Sparkles className="w-3 h-3" />
                        {generatingLink[doc.id] ? 'Generating...' : 'Generate Link'}
                      </button>
                    </div>
                    <p className="text-xs text-warm-gray">
                      {magicLinks.filter(l => l.documentId === doc.id && l.status === 'active').length} active link(s)
                    </p>
                  </div>
                ))}
              </div>
              
              {magicLinks.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h3 className="text-sm font-semibold text-charcoal mb-2">All Magic Links</h3>
                  {magicLinks.map((link) => {
                    const doc = DOCUMENTS.find(d => d.id === link.documentId)
                    const linkUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://tweedcollective.ai'}/magic-link/${link.token}`
                    
                    return (
                      <div key={link.token} className="p-3 rounded-lg border border-stone/20 bg-stone/5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-grow min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm text-charcoal">{doc?.title || link.documentId}</span>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                link.status === 'active' ? 'bg-green-100 text-green-700' :
                                link.status === 'used' ? 'bg-blue-100 text-blue-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {link.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                              <code className="text-xs text-warm-gray font-mono bg-stone/20 px-2 py-0.5 rounded truncate max-w-md">
                                {linkUrl}
                              </code>
                              <button
                                onClick={() => copyMagicLink(linkUrl)}
                                className="p-1 hover:bg-stone/20 rounded transition-colors"
                                title="Copy link"
                              >
                                <Copy className="w-3 h-3 text-warm-gray" />
                              </button>
                            </div>
                            <div className="text-xs text-warm-gray space-y-0.5">
                              <div>Created: {new Date(link.createdAt).toLocaleString()}</div>
                              {link.expiresAt && (
                                <div>Expires: {new Date(link.expiresAt).toLocaleString()}</div>
                              )}
                              {link.usedAt && (
                                <div>Used: {new Date(link.usedAt).toLocaleString()}</div>
                              )}
                            </div>
                          </div>
                          {link.status === 'active' && (
                            <button
                              onClick={() => revokeMagicLink(link.token)}
                              className="p-2 hover:bg-red-50 rounded transition-colors text-red-600"
                              title="Revoke link"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Users List */}
          <div className="bg-white rounded-xl border border-stone/30 overflow-hidden">
            <div className="px-6 py-4 border-b border-stone/20 bg-stone/10">
              <h2 className="text-lg font-semibold text-charcoal">Users & Document Access</h2>
            </div>
            
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-4 border-sage/30 border-t-sage rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-warm-gray">Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center text-warm-gray">
                No users found
              </div>
            ) : (
              <div className="divide-y divide-stone/20">
                {users.map((u) => (
                  <div key={u.id} className="px-6 py-4">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setExpandedUser(expandedUser === u.id ? null : u.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center">
                          <span className="text-sage font-semibold">
                            {(u.firstName?.[0] || u.email[0]).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-charcoal">
                            {u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : u.email}
                          </p>
                          <p className="text-sm text-warm-gray">{u.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {u.documentAccess.length > 0 && u.grantInfo && (
                          <div className="flex items-center gap-2">
                            {Object.entries(u.grantInfo).slice(0, 2).map(([docId, info]) => (
                              <span
                                key={docId}
                                className="px-2 py-0.5 rounded text-xs font-medium"
                                title={`Granted via ${info.method} on ${new Date(info.timestamp).toLocaleString()}`}
                                style={{
                                  backgroundColor: info.method === 'bulk-email' ? '#d1fae5' : info.method === 'magic-link' ? '#fef3c7' : '#e5e7eb',
                                  color: info.method === 'bulk-email' ? '#065f46' : info.method === 'magic-link' ? '#92400e' : '#374151'
                                }}
                              >
                                {info.method === 'bulk-email' ? '📧' : info.method === 'magic-link' ? '✨' : '👤'}
                              </span>
                            ))}
                          </div>
                        )}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          u.documentAccess.length > 0 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-stone/20 text-warm-gray'
                        }`}>
                          {u.documentAccess.length} document{u.documentAccess.length !== 1 ? 's' : ''}
                        </span>
                        {expandedUser === u.id ? (
                          <ChevronUp className="w-5 h-5 text-warm-gray" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-warm-gray" />
                        )}
                      </div>
                    </div>
                    
                    {expandedUser === u.id && (
                      <div className="mt-4 pl-14 space-y-2">
                        {DOCUMENTS.map((doc) => {
                          const hasAccess = u.documentAccess.includes(doc.id)
                          const isUpdating = updating === `${u.id}-${doc.id}`
                          const grantInfo = u.grantInfo?.[doc.id]
                          
                          return (
                            <div 
                              key={doc.id}
                              className="flex items-center justify-between p-3 rounded-lg bg-stone/10"
                            >
                              <div className="flex-grow">
                                <span className="text-sm text-charcoal">{doc.title}</span>
                                {hasAccess && grantInfo && (
                                  <div className="text-xs text-warm-gray mt-1 flex items-center gap-2">
                                    <span>
                                      {grantInfo.method === 'bulk-email' ? '📧 Auto-granted via bulk email' :
                                       grantInfo.method === 'magic-link' ? '✨ Auto-granted via magic link' :
                                       '👤 Manually granted'}
                                    </span>
                                    <span className="text-zinc">
                                      {new Date(grantInfo.timestamp).toLocaleDateString()} {new Date(grantInfo.timestamp).toLocaleTimeString()}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleAccess(u.id, doc.id, hasAccess)
                                }}
                                disabled={isUpdating}
                                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                  hasAccess
                                    ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700'
                                    : 'bg-stone/20 text-warm-gray hover:bg-green-100 hover:text-green-700'
                                } ${isUpdating ? 'opacity-50' : ''}`}
                              >
                                {isUpdating ? '...' : hasAccess ? 'Revoke' : 'Grant'}
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
