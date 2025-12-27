'use client'

import React, { useState, useEffect } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import { Shield, Users, FileText, Check, X, RefreshCw, ChevronDown, ChevronUp, Mail } from 'lucide-react'
import Link from 'next/link'

interface UserWithAccess {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  documentAccess: string[]
  createdAt: string
}

// List of available documents
const DOCUMENTS = [
  { id: 'vibe-coding-pe-life-sciences', title: 'VIBE Coding in Enterprise' },
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
        setEmailTestResult(`✅ Test email sent successfully! Check your inbox at nbeyor@gmail.com`)
      } else {
        setEmailTestResult(`❌ Error: ${data.error || data.details || 'Unknown error'}`)
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
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet text-cream hover:bg-violet-light disabled:opacity-50 transition-colors"
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
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <span className="text-purple-700 font-semibold">
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
                              <span className="text-sm text-charcoal">{doc.title}</span>
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
