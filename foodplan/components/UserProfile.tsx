'use client'

import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [supabase, setSupabase] = useState<any>(null)

  useEffect(() => {
    // Only initialize Supabase on the client
    import('@/lib/supabase/client').then(({ createClient }) => {
      try {
        const client = createClient()
        setSupabase(client)
      } catch (err) {
        setError('Supabase not configured')
        setLoading(false)
      }
    })
  }, [])

  useEffect(() => {
    if (!supabase) return

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  if (error) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">User Profile</h2>
        <p className="text-sm text-gray-600">
          Supabase not configured. Please set up your .env.local file.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="animate-pulse bg-white shadow rounded-lg p-6">
        <div className="h-4 bg-gray-200 rounded w-48 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">User Profile</h2>
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-500">Email</label>
          <p className="mt-1 text-sm text-gray-900">{user.email}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">User ID</label>
          <p className="mt-1 text-sm text-gray-900 font-mono">{user.id}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Created</label>
          <p className="mt-1 text-sm text-gray-900">
            {new Date(user.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}
