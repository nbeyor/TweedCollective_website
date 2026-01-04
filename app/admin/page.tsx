'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Shield, Users, FileText, Check, RefreshCw, ChevronDown, ChevronUp, Mail, Copy, Trash2, Clock, Send, UserX } from 'lucide-react'
import Link from 'next/link'
import { getGrantablePermissions } from '@/content/documents'
import type { UserWithAccess, Invitation } from '@/lib/types'

// Get documents/permissions from centralized registry
const DOCUMENTS = getGrantablePermissions()

export default function AdminPage() {
  const { userId, isLoaded } = useAuth()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [users, setUsers] = useState<UserWithAccess[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [expandedUser, setExpandedUser] = useState<string | null>(null)
  const [expandedDocument, setExpandedDocument] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)
  const [testingEmail, setTestingEmail] = useState(false)
  const [emailTestResult, setEmailTestResult] = useState<string | null>(null)
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [adminEmails, setAdminEmails] = useState<string[]>([])
  
  // Per-document invitation state
  const [docInviteEmails, setDocInviteEmails] = useState<Record<string, string>>({})
  const [sendingDocInvite, setSendingDocInvite] = useState<Record<string, boolean>>({})
  const [deletingUser, setDeletingUser] = useState<string | null>(null)
  const [revokingInvite, setRevokingInvite] = useState<string | null>(null)

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

  async function sendDocumentInvitation(documentId: string) {
    const emailText = docInviteEmails[documentId]
    if (!emailText?.trim()) {
      setError('Please enter at least one email address')
      return
    }

    const emailList = emailText
      .split(/[\n,;]/)
      .map(e => e.trim())
      .filter(e => e.length > 0 && e.includes('@'))

    if (emailList.length === 0) {
      setError('No valid email addresses found')
      return
    }

    setSendingDocInvite({ ...sendingDocInvite, [documentId]: true })
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await fetch('/api/admin/magic-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          documentId, 
          emails: emailList,
          expiresInDays: 7 
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        const successCount = data.results?.filter((r: { success: boolean }) => r.success).length || 0
        const failedResults = data.results?.filter((r: { success: boolean; error?: string }) => !r.success) || []
        
        const docTitle = DOCUMENTS.find(d => d.id === documentId)?.title || documentId
        
        if (failedResults.length > 0) {
          // Show which emails failed and why
          const failedEmails = failedResults.map((r: { email: string; error?: string }) => 
            `${r.email}: ${r.error || 'Unknown error'}`
          ).join(', ')
          setError(`Email failed for: ${failedEmails}`)
        }
        
        if (successCount > 0) {
          setSuccessMessage(`Sent ${successCount} invitation(s) for "${docTitle}"`)
        } else if (failedResults.length > 0) {
          setSuccessMessage(null) // Only show error
        }
        
        setDocInviteEmails({ ...docInviteEmails, [documentId]: '' })
        await fetchInvitations()
      } else {
        setError(data.error || 'Failed to send invitations')
      }
    } catch (err) {
      setError('Failed to send invitations')
    } finally {
      setSendingDocInvite({ ...sendingDocInvite, [documentId]: false })
    }
  }

  async function revokeInvitation(token: string) {
    if (revokingInvite) return // Prevent double-clicks
    
    setRevokingInvite(token)
    setError(null)
    setSuccessMessage(null)
    
    // Optimistically remove from UI immediately
    const previousInvitations = [...invitations]
    setInvitations(invitations.filter(i => i.token !== token))
    
    try {
      console.log('Deleting invitation:', token)
      const response = await fetch('/api/admin/magic-links', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })
      
      console.log('Delete response status:', response.status)
      const data = await response.json()
      console.log('Delete response data:', data)
      
      if (data.success) {
        setSuccessMessage(`Invitation revoked (${data.remainingLinks ?? '?'} remaining)`)
        setError(null)
        // Don't restore - keep the optimistic update
      } else {
        // Restore on failure
        console.error('Delete failed:', data)
        setInvitations(previousInvitations)
        setError(`Failed: ${data.error || 'Unknown error'}${data.debug ? ' - ' + JSON.stringify(data.debug) : ''}`)
      }
    } catch (err) {
      // Restore on error
      console.error('Delete exception:', err)
      setInvitations(previousInvitations)
      setError(`Network error: ${err instanceof Error ? err.message : 'Unknown'}`)
    } finally {
      setRevokingInvite(null)
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

  // Helper to get invitations for a document
  function getDocumentInvitations(documentId: string) {
    return invitations.filter(i => i.documentId === documentId)
  }

  // Helper to get users with access to a document
  function getUsersWithAccess(documentId: string) {
    return users.filter(u => u.documentAccess.includes(documentId))
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
              <p className="text-warm-gray">Manage documents, invitations, and user access</p>
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
                onClick={() => { fetchUsers(); fetchInvitations(); }}
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
                <Mail className="w-8 h-8 text-taupe" />
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

          {/* Documents & Invitations */}
          <div className="bg-white rounded-xl border border-stone/30 overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-stone/20 bg-stone/10">
              <h2 className="text-lg font-semibold text-charcoal">Documents & Invitations</h2>
              <p className="text-sm text-warm-gray mt-1">Send invitations for each document</p>
            </div>
            <div className="divide-y divide-stone/20">
              {DOCUMENTS.map((doc) => {
                const docInvitations = getDocumentInvitations(doc.id)
                const usersWithAccess = getUsersWithAccess(doc.id)
                const activeInvites = docInvitations.filter(i => i.status === 'active')
                const isExpanded = expandedDocument === doc.id
                
                return (
                  <div key={doc.id} className="px-6 py-4">
                    <div
                      className="flex items-center justify-between"
                    >
                      <div
                        className="flex items-center gap-4 cursor-pointer flex-grow"
                        onClick={() => setExpandedDocument(isExpanded ? null : doc.id)}
                      >
                        <FileText className="w-6 h-6 text-taupe" />
                        <div>
                          <h3 className="font-medium text-charcoal">{doc.title}</h3>
                          <p className="text-sm text-warm-gray">
                            {usersWithAccess.length} user{usersWithAccess.length !== 1 ? 's' : ''} with access
                            {activeInvites.length > 0 && ` • ${activeInvites.length} pending invite${activeInvites.length !== 1 ? 's' : ''}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={`/documents/${doc.id}/export`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 text-sm font-medium text-sage bg-sage/10 hover:bg-sage/20 rounded-lg transition-colors flex items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Export
                        </a>
                        <button
                          onClick={() => setExpandedDocument(isExpanded ? null : doc.id)}
                          className="p-2"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-warm-gray" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-warm-gray" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className="mt-4 pl-10 space-y-4">
                        {/* Invite Form */}
                        <div className="p-4 rounded-lg bg-stone/5 border border-stone/20">
                          <label className="block text-sm font-medium text-charcoal mb-2">
                            Send Invitations
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={docInviteEmails[doc.id] || ''}
                              onChange={(e) => setDocInviteEmails({ ...docInviteEmails, [doc.id]: e.target.value })}
                              placeholder="Enter email addresses (comma-separated)"
                              className="flex-grow px-4 py-2 rounded-lg border border-stone/30 bg-white text-charcoal text-sm focus:outline-none focus:border-sage"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                sendDocumentInvitation(doc.id)
                              }}
                              disabled={sendingDocInvite[doc.id] || !docInviteEmails[doc.id]?.trim()}
                              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sage text-cream hover:bg-sage/90 disabled:opacity-50 transition-colors text-sm font-medium whitespace-nowrap"
                            >
                              <Send className="w-4 h-4" />
                              {sendingDocInvite[doc.id] ? 'Sending...' : 'Send'}
                            </button>
                          </div>
                          <p className="text-xs text-warm-gray mt-2">
                            Each person receives a unique link valid for 7 days.
                          </p>
                        </div>

                        {/* Pending Invitations for this document */}
                        {activeInvites.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-charcoal mb-2">Pending Invitations</h4>
                            <div className="space-y-2">
                              {activeInvites.map((invite) => (
                                <div key={invite.token} className="flex items-center justify-between p-3 rounded-lg bg-stone/5 border border-stone/20">
                                  <div>
                                    <span className="text-sm text-charcoal">{invite.targetEmail}</span>
                                    <div className="text-xs text-warm-gray flex items-center gap-2 mt-0.5">
                                      <Clock className="w-3 h-3" />
                                      Expires: {new Date(invite.expiresAt).toLocaleDateString()}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={async (e) => {
                                        e.stopPropagation()
                                        const url = `${window.location.origin}/magic-link/${invite.token}`
                                        await navigator.clipboard.writeText(url)
                                        setSuccessMessage('Invitation link copied!')
                                      }}
                                      className="p-1.5 hover:bg-stone/20 rounded transition-colors text-warm-gray"
                                      title="Copy link"
                                    >
                                      <Copy className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        revokeInvitation(invite.token)
                                      }}
                                      disabled={revokingInvite === invite.token}
                                      className={`p-1.5 hover:bg-red-50 rounded transition-colors text-red-600 ${revokingInvite === invite.token ? 'opacity-50' : ''}`}
                                      title="Revoke"
                                    >
                                      <Trash2 className={`w-4 h-4 ${revokingInvite === invite.token ? 'animate-pulse' : ''}`} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Users with access */}
                        {usersWithAccess.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-charcoal mb-2">Users with Access</h4>
                            <div className="flex flex-wrap gap-2">
                              {usersWithAccess.map((u) => (
                                <span key={u.id} className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium">
                                  {u.email}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Users List */}
          <div className="bg-white rounded-xl border border-stone/30 overflow-hidden">
            <div className="px-6 py-4 border-b border-stone/20 bg-stone/10">
              <h2 className="text-lg font-semibold text-charcoal">Users & Document Access</h2>
              <p className="text-sm text-warm-gray mt-1">Manage individual user access and remove users</p>
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
