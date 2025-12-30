'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Shield, Users, FileText, Check, X, RefreshCw, ChevronDown, ChevronUp, Mail, Copy, Trash2, Clock, Send, UserX } from 'lucide-react'
import Link from 'next/link'

interface UserWithAccess {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  documentAccess: string[]
  createdAt: string
  grantInfo?: Record<string, { method: 'invitation' | 'manual', timestamp: string }>
}

interface Invitation {
  token: string
  documentId: string
  documentTitle?: string
  targetEmail: string
  createdAt: string
  expiresAt: string
  redeemedAt?: string
  redeemedBy?: string
  status: 'active' | 'expired' | 'redeemed'
}

interface AuditEntry {
  userId: string
  email: string
  documentIds: string[]
  timestamp: string
  method: 'invitation' | 'manual'
}

// List of available documents and permissions
const DOCUMENTS = [
  { id: 'vibe-coding-in-enterprise-for-pe', title: 'VIBE Coding in Enterprise' },
  { id: 'health-tech-market-2024', title: 'Health-Tech Market Landscape' },
  { id: 'ai-integration-framework', title: 'AI Integration Framework' },
  { id: 'salmon-ai-genomics', title: 'Strategic AI for Salmon Genomics' },
  { id: 'internal-access', title: 'Internal Tools Access' },
]

export default function AdminPage() {
  const { userId, isLoaded } = useAuth()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [users, setUsers] = useState<UserWithAccess[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [expandedUser, setExpandedUser] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)
  const [testingEmail, setTestingEmail] = useState(false)
  const [emailTestResult, setEmailTestResult] = useState<string | null>(null)
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [adminEmails, setAdminEmails] = useState<string[]>([])
  
  // Invitation form state
  const [selectedDocument, setSelectedDocument] = useState<string>('')
  const [inviteEmails, setInviteEmails] = useState('')
  const [sendingInvites, setSendingInvites] = useState(false)
  const [deletingUser, setDeletingUser] = useState<string | null>(null)

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
          fetchInvitations()
          fetchAdminEmails()
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

  async function fetchInvitations() {
    try {
      const response = await fetch('/api/admin/magic-links')
      const data = await response.json()
      if (data.magicLinks) {
        setInvitations(data.magicLinks)
      }
    } catch (err) {
      console.error('Failed to fetch invitations:', err)
    }
  }

  async function fetchAdminEmails() {
    try {
      const response = await fetch('/api/admin/emails')
      const data = await response.json()
      if (data.emails) {
        setAdminEmails(data.emails)
      }
    } catch (err) {
      console.error('Failed to fetch admin emails:', err)
    }
  }

  async function sendInvitations() {
    if (!selectedDocument || !inviteEmails.trim()) {
      setError('Please select a document and enter at least one email address')
      return
    }

    const emailList = inviteEmails
      .split(/[\n,;]/)
      .map(e => e.trim())
      .filter(e => e.length > 0 && e.includes('@'))

    if (emailList.length === 0) {
      setError('No valid email addresses found')
      return
    }

    setSendingInvites(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await fetch('/api/admin/magic-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          documentId: selectedDocument, 
          emails: emailList,
          expiresInDays: 7 
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        const successCount = data.results?.filter((r: { success: boolean }) => r.success).length || 0
        const failCount = data.results?.filter((r: { success: boolean }) => !r.success).length || 0
        
        setSuccessMessage(`Sent ${successCount} invitation(s) successfully${failCount > 0 ? `, ${failCount} failed` : ''}`)
        setInviteEmails('')
        setSelectedDocument('')
        await fetchInvitations()
      } else {
        setError(data.error || 'Failed to send invitations')
      }
    } catch (err) {
      setError('Failed to send invitations')
    } finally {
      setSendingInvites(false)
    }
  }

  async function revokeInvitation(token: string) {
    try {
      const response = await fetch('/api/admin/magic-links', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })
      
      const data = await response.json()
      
      if (data.success) {
        await fetchInvitations()
        setError(null)
      } else {
        setError(data.error || 'Failed to revoke invitation')
      }
    } catch (err) {
      setError('Failed to revoke invitation')
    }
  }

  async function deleteUser(targetUserId: string) {
    if (!confirm('Are you sure you want to delete this user? They will need to sign up again.')) {
      return
    }

    setDeletingUser(targetUserId)
    try {
      const response = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: targetUserId })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setUsers(users.filter(u => u.id !== targetUserId))
        setSuccessMessage('User deleted successfully')
      } else {
        setError(data.error || 'Failed to delete user')
      }
    } catch (err) {
      setError('Failed to delete user')
    } finally {
      setDeletingUser(null)
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
        const emails = data.adminEmails ? ` (${data.adminEmails.join(', ')})` : ''
        setEmailTestResult(`✅ Test email sent successfully to Admin${emails}!`)
      } else {
        setEmailTestResult(`❌ Error: ${data.error || 'Unknown error'}`)
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setEmailTestResult(`❌ Failed to send test email: ${errorMessage}`)
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
            You don&apos;t have admin privileges. Contact the site administrator if you believe this is an error.
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
              <p className="text-warm-gray">Manage user document access and send invitations</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={testEmail}
                disabled={testingEmail}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sage text-cream hover:bg-sage/90 disabled:opacity-50 transition-colors"
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

          {/* Messages */}
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

          {successMessage && (
            <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700">
              {successMessage}
              <button onClick={() => setSuccessMessage(null)} className="ml-4 underline">Dismiss</button>
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
                <FileText className="w-8 h-8 text-taupe" />
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
                <Mail className="w-8 h-8 text-gold" />
                <div>
                  <p className="text-2xl font-bold text-charcoal">
                    {invitations.filter(i => i.status === 'active').length}
                  </p>
                  <p className="text-sm text-warm-gray">Pending Invites</p>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Emails Info */}
          {adminEmails.length > 0 && (
            <div className="bg-white rounded-xl border border-stone/30 overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-stone/20 bg-stone/10">
                <h2 className="text-lg font-semibold text-charcoal">Admin Notifications</h2>
                <p className="text-sm text-warm-gray mt-1">These emails receive new user signup notifications and access requests</p>
              </div>
              <div className="px-6 py-4">
                <div className="flex flex-wrap gap-2">
                  {adminEmails.map((email, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-lg bg-sage/10 text-sage font-mono text-sm border border-sage/20">
                      {email}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Send Invitations */}
          <div className="bg-white rounded-xl border border-stone/30 overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-stone/20 bg-stone/10">
              <h2 className="text-lg font-semibold text-charcoal">Send Invitations</h2>
              <p className="text-sm text-warm-gray mt-1">Invite people by email - they&apos;ll receive a link to access the document</p>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Select Document
                </label>
                <select
                  value={selectedDocument}
                  onChange={(e) => setSelectedDocument(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-stone/30 bg-white text-charcoal focus:outline-none focus:border-sage"
                >
                  <option value="">Choose a document...</option>
                  {DOCUMENTS.map(doc => (
                    <option key={doc.id} value={doc.id}>{doc.title}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Email Addresses
                </label>
                <textarea
                  value={inviteEmails}
                  onChange={(e) => setInviteEmails(e.target.value)}
                  placeholder="Enter email addresses (one per line, or comma-separated)"
                  className="w-full h-24 px-4 py-3 rounded-lg border border-stone/30 bg-white text-charcoal font-mono text-sm resize-none focus:outline-none focus:border-sage"
                />
                <p className="text-xs text-warm-gray mt-2">
                  Each person will receive a unique invitation link valid for 7 days. They must sign in with the invited email.
                </p>
              </div>
              
              <button
                onClick={sendInvitations}
                disabled={sendingInvites || !selectedDocument || !inviteEmails.trim()}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-sage text-cream hover:bg-sage/90 disabled:opacity-50 transition-colors font-medium"
              >
                <Send className="w-4 h-4" />
                {sendingInvites ? 'Sending...' : 'Send Invitations'}
              </button>
            </div>
          </div>

          {/* Pending Invitations */}
          {invitations.length > 0 && (
            <div className="bg-white rounded-xl border border-stone/30 overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-stone/20 bg-stone/10">
                <h2 className="text-lg font-semibold text-charcoal">Invitations</h2>
                <p className="text-sm text-warm-gray mt-1">Track sent invitations and their status</p>
              </div>
              <div className="divide-y divide-stone/20">
                {invitations.map((invite) => {
                  const doc = DOCUMENTS.find(d => d.id === invite.documentId)
                  
                  return (
                    <div key={invite.token} className="px-6 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-charcoal">{invite.targetEmail}</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              invite.status === 'active' ? 'bg-yellow-100 text-yellow-700' :
                              invite.status === 'redeemed' ? 'bg-green-100 text-green-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {invite.status === 'active' ? 'Pending' : 
                               invite.status === 'redeemed' ? 'Redeemed' : 'Expired'}
                            </span>
                          </div>
                          <div className="text-sm text-warm-gray">
                            {doc?.title || invite.documentId}
                          </div>
                          <div className="text-xs text-warm-gray mt-1 flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Sent: {new Date(invite.createdAt).toLocaleDateString()}
                            </span>
                            <span>
                              Expires: {new Date(invite.expiresAt).toLocaleDateString()}
                            </span>
                            {invite.redeemedAt && (
                              <span className="text-green-600">
                                Redeemed: {new Date(invite.redeemedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        {invite.status === 'active' && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={async () => {
                                const url = `${window.location.origin}/magic-link/${invite.token}`
                                await navigator.clipboard.writeText(url)
                                setSuccessMessage('Invitation link copied to clipboard!')
                              }}
                              className="p-2 hover:bg-stone/20 rounded transition-colors text-warm-gray"
                              title="Copy link"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => revokeInvitation(invite.token)}
                              className="p-2 hover:bg-red-50 rounded transition-colors text-red-600"
                              title="Revoke invitation"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Users List */}
          <div className="bg-white rounded-xl border border-stone/30 overflow-hidden">
            <div className="px-6 py-4 border-b border-stone/20 bg-stone/10">
              <h2 className="text-lg font-semibold text-charcoal">Users & Document Access</h2>
              <p className="text-sm text-warm-gray mt-1">Manage access and remove users</p>
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
                                  <div className="text-xs text-warm-gray mt-1">
                                    {grantInfo.method === 'invitation' ? '✉️ Via invitation' : '👤 Manual'} - {new Date(grantInfo.timestamp).toLocaleDateString()}
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
                        
                        {/* Delete User Button */}
                        <div className="pt-3 mt-3 border-t border-stone/20">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteUser(u.id)
                            }}
                            disabled={deletingUser === u.id}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-sm"
                          >
                            <UserX className="w-4 h-4" />
                            {deletingUser === u.id ? 'Deleting...' : 'Delete User'}
                          </button>
                        </div>
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
