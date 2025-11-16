'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { UserProfile, UserRole, CreateUserProfile, Family } from '@/types'
import FamilyMemberCard from '@/components/FamilyMemberCard'
import AddFamilyMemberForm from '@/components/AddFamilyMemberForm'
import EditFamilyMemberForm from '@/components/EditFamilyMemberForm'
import InviteFamilyMemberModal from '@/components/InviteFamilyMemberModal'

type ViewMode = 'list' | 'add' | 'edit'

/**
 * Family Profile Page
 *
 * Family Sharing Model:
 * - Displays all profiles for the user's family
 * - Redirects to setup page if user doesn't have a family
 * - Shows family name and allows inviting other parents
 * - Both parent accounts can view/edit all profiles
 */
export default function FamilyProfilePage() {
  const router = useRouter()
  const [family, setFamily] = useState<Family | null>(null)
  const [profiles, setProfiles] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [editingProfile, setEditingProfile] = useState<UserProfile | null>(null)
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('')
  const [showInviteModal, setShowInviteModal] = useState(false)

  useEffect(() => {
    checkFamilyAndFetchProfiles()
    getCurrentUser()
  }, [])

  const getCurrentUser = async () => {
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user?.email) {
        setCurrentUserEmail(user.email)
      }
    } catch (error) {
      console.error('Error getting current user:', error)
    }
  }

  const checkFamilyAndFetchProfiles = async () => {
    try {
      setLoading(true)
      setError(null)

      // Check if user has a family
      const familyResponse = await fetch('/api/family')
      const familyData = await familyResponse.json()

      if (!familyResponse.ok) {
        throw new Error(familyData.error || 'Failed to fetch family')
      }

      // If no family, redirect to setup
      if (!familyData.family) {
        router.push('/dashboard/setup')
        return
      }

      setFamily(familyData.family)

      // Fetch profiles
      const profilesResponse = await fetch('/api/profiles')
      const profilesData = await profilesResponse.json()

      if (!profilesResponse.ok) {
        throw new Error(profilesData.error || 'Failed to fetch profiles')
      }

      setProfiles(profilesData.profiles || [])
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const fetchProfiles = async () => {
    try {
      setError(null)

      const response = await fetch('/api/profiles')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch profiles')
      }

      setProfiles(data.profiles || [])
    } catch (err) {
      console.error('Error fetching profiles:', err)
      setError(err instanceof Error ? err.message : 'Failed to load profiles')
    }
  }

  const handleAddProfile = async (profileData: Omit<CreateUserProfile, 'family_id'>) => {
    try {
      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create profile')
      }

      // Refresh profiles and return to list view
      await fetchProfiles()
      setViewMode('list')
      alert('Family member added successfully!')
    } catch (err) {
      console.error('Error adding profile:', err)
      alert(err instanceof Error ? err.message : 'Failed to add family member')
      throw err
    }
  }

  const handleEditProfile = async (
    id: string,
    updates: Partial<UserProfile>
  ) => {
    try {
      const response = await fetch(`/api/profiles/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }

      // Refresh profiles and return to list view
      await fetchProfiles()
      setViewMode('list')
      setEditingProfile(null)
      alert('Family member updated successfully!')
    } catch (err) {
      console.error('Error updating profile:', err)
      alert(err instanceof Error ? err.message : 'Failed to update family member')
      throw err
    }
  }

  const handleDeleteProfile = async (profile: UserProfile) => {
    const confirmed = confirm(
      `Are you sure you want to delete ${profile.full_name || 'this family member'}? This action cannot be undone.`
    )

    if (!confirmed) return

    try {
      const response = await fetch(`/api/profiles/${profile.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete profile')
      }

      // Refresh profiles
      await fetchProfiles()
      alert('Family member deleted successfully!')
    } catch (err) {
      console.error('Error deleting profile:', err)
      alert(err instanceof Error ? err.message : 'Failed to delete family member')
    }
  }

  const getUsedRoles = (): UserRole[] => {
    return profiles.map((p) => p.role).filter(Boolean) as UserRole[]
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {family?.name || 'Family Dietary Profiles'}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your family members and their dietary restrictions to get
              personalized meal plans and shopping suggestions.
            </p>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="hidden sm:flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            Invite Parent
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* View: List */}
      {viewMode === 'list' && (
        <>
          {profiles.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-12 text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No family members yet
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Get started by adding your first family member profile.
              </p>
              <button
                onClick={() => setViewMode('add')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add First Family Member
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-600">
                  {profiles.length} {profiles.length === 1 ? 'member' : 'members'}{' '}
                  in your family
                </p>
                <button
                  onClick={() => setViewMode('add')}
                  disabled={profiles.length >= 4}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Family Member
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.map((profile) => (
                  <FamilyMemberCard
                    key={profile.id}
                    profile={profile}
                    onEdit={(p) => {
                      setEditingProfile(p)
                      setViewMode('edit')
                    }}
                    onDelete={handleDeleteProfile}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* View: Add */}
      {viewMode === 'add' && (
        <div className="max-w-2xl">
          <AddFamilyMemberForm
            onSubmit={handleAddProfile}
            onCancel={() => setViewMode('list')}
            currentUserEmail={profiles.length === 0 ? currentUserEmail : undefined}
            usedRoles={getUsedRoles()}
          />
        </div>
      )}

      {/* View: Edit */}
      {viewMode === 'edit' && editingProfile && (
        <div className="max-w-2xl">
          <EditFamilyMemberForm
            profile={editingProfile}
            onSubmit={handleEditProfile}
            onCancel={() => {
              setEditingProfile(null)
              setViewMode('list')
            }}
            usedRoles={getUsedRoles()}
          />
        </div>
      )}

      {/* Invite Family Member Modal */}
      {showInviteModal && family && (
        <InviteFamilyMemberModal
          familyId={family.id}
          onClose={() => setShowInviteModal(false)}
        />
      )}
    </div>
  )
}
