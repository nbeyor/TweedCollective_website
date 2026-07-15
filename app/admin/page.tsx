'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Shield, Users, FileText, Check, RefreshCw, ChevronDown, ChevronUp, Mail, UserX } from 'lucide-react'
import Link from 'next/link'
import { getGrantablePermissions } from '@/content/documents'
import { CLIENT_CONFIGS } from '@/content/clients'
import type { UserWithAccess } from '@/lib/types'

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
  const [adminEmails, setAdminEmails] = useState<string[]>([])
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

  async function toggleClientAccess(targetUserId: string, clientSlug: string, currentlyHasAccess: boolean) {
    setUpdating(`${targetUserId}-ws-${clientSlug}`)

    try {
      const response = await fetch('/api/admin/update-client-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: targetUserId,
          clientSlug,
          action: currentlyHasAccess ? 'revoke' : 'grant'
        })
      })

      const data = await response.json()

      if (data.success) {
        setUsers(users.map(u => (u.id === targetUserId ? { ...u, clientSlugs: data.clientSlugs } : u)))
      } else {
        setError(data.error || 'Failed to update workspace access')
      }
    } catch (err) {
      setError('Failed to update workspace access')
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
              <p className="text-warm-gray">Manage documents and user access</p>
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
                onClick={() => fetchUsers()}
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
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

          {/* Documents */}
          <div className="bg-white rounded-xl border border-stone/30 overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-stone/20 bg-stone/10">
              <h2 className="text-lg font-semibold text-charcoal">Documents</h2>
              <p className="text-sm text-warm-gray mt-1">Who has access to each document</p>
            </div>
            <div className="divide-y divide-stone/20">
              {DOCUMENTS.map((doc) => {
                const usersWithAccess = getUsersWithAccess(doc.id)
                const isExpanded = expandedDocument === doc.id

                return (
                  <div key={doc.id} className="px-6 py-4">
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setExpandedDocument(isExpanded ? null : doc.id)}
                    >
                      <div className="flex items-center gap-4 flex-grow">
                        <FileText className="w-6 h-6 text-taupe" />
                        <div>
                          <h3 className="font-medium text-charcoal">{doc.title}</h3>
                          <p className="text-sm text-warm-gray">
                            {usersWithAccess.length} user{usersWithAccess.length !== 1 ? 's' : ''} with access
                          </p>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-warm-gray" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-warm-gray" />
                      )}
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pl-10">
                        {usersWithAccess.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {usersWithAccess.map((u) => (
                              <span key={u.id} className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium">
                                {u.email}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-warm-gray">
                            No users yet. Grant access per user in the list below once they&apos;ve signed up.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Client Workspaces */}
          {CLIENT_CONFIGS.length > 0 && (
            <div className="bg-white rounded-xl border border-stone/30 overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-stone/20 bg-stone/10">
                <h2 className="text-lg font-semibold text-charcoal">Client Workspaces</h2>
                <p className="text-sm text-warm-gray mt-1">Who has access to each client workspace and its dashboards</p>
              </div>
              <div className="divide-y divide-stone/20">
                {CLIENT_CONFIGS.map((workspace) => {
                  const usersWithWorkspace = users.filter(u => u.clientSlugs.includes(workspace.slug))

                  return (
                    <div key={workspace.slug} className="px-6 py-4">
                      <div className="flex items-center gap-4 mb-2">
                        <Users className="w-6 h-6 text-taupe" />
                        <div>
                          <h3 className="font-medium text-charcoal">{workspace.name}</h3>
                          <p className="text-sm text-warm-gray">
                            /clients/{workspace.slug} • {usersWithWorkspace.length} user{usersWithWorkspace.length !== 1 ? 's' : ''} with access
                          </p>
                        </div>
                      </div>
                      {usersWithWorkspace.length > 0 ? (
                        <div className="flex flex-wrap gap-2 pl-10">
                          {usersWithWorkspace.map((u) => (
                            <span key={u.id} className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium">
                              {u.email}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-warm-gray pl-10">
                          No users yet. Grant access per user in the list below once they&apos;ve signed up.
                        </p>
                      )}
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

                          return (
                            <div
                              key={doc.id}
                              className="flex items-center justify-between p-3 rounded-lg bg-stone/10"
                            >
                              <div className="flex-grow">
                                <span className="text-sm text-charcoal">{doc.title}</span>
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

                        {/* Client workspace access */}
                        {CLIENT_CONFIGS.length > 0 && (
                          <>
                            <p className="text-xs font-medium text-warm-gray uppercase tracking-wide pt-3">
                              Client Workspaces
                            </p>
                            {CLIENT_CONFIGS.map((workspace) => {
                              const hasAccess = u.clientSlugs.includes(workspace.slug)
                              const isUpdating = updating === `${u.id}-ws-${workspace.slug}`

                              return (
                                <div
                                  key={workspace.slug}
                                  className="flex items-center justify-between p-3 rounded-lg bg-stone/10"
                                >
                                  <div className="flex-grow">
                                    <span className="text-sm text-charcoal">{workspace.name} workspace</span>
                                    <div className="text-xs text-warm-gray mt-1">
                                      /clients/{workspace.slug}
                                    </div>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleClientAccess(u.id, workspace.slug, hasAccess)
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
                          </>
                        )}

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
