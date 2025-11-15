'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { CreateUserProfile } from '@/types'

type SetupStep = 'family' | 'profile'
type FamilySetupMode = 'create' | 'join'

/**
 * First-Time Setup Page
 *
 * This page guides new users through setting up their family:
 * Step 1: Create a NEW family OR Join an EXISTING family
 * Step 2: Create their first profile (usually the logged-in parent)
 *
 * After setup completes, users are redirected to the family profiles page
 */
export default function SetupPage() {
  const router = useRouter()
  const [step, setStep] = useState<SetupStep>('family')
  const [setupMode, setSetupMode] = useState<FamilySetupMode>('create')
  const [familyName, setFamilyName] = useState('')
  const [joinFamilyId, setJoinFamilyId] = useState('')
  const [familyId, setFamilyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Profile form state
  const [profileData, setProfileData] = useState<CreateUserProfile>({
    family_id: '', // Will be set after family creation
    email: '',
    full_name: '',
    role: undefined as any,
    is_gluten_free: true,
    has_nut_allergy: false,
    can_eat_almonds: true,
    avoid_saturated_fat: false,
    avoid_potatoes: false,
    can_eat_sweet_potatoes: true,
  })

  const handleCreateFamily = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!familyName.trim()) {
      setError('Please enter a family name')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/family', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: familyName }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create family')
      }

      setFamilyId(data.family.id)
      setProfileData({ ...profileData, family_id: data.family.id })
      setStep('profile')
    } catch (err) {
      console.error('Error creating family:', err)
      setError(err instanceof Error ? err.message : 'Failed to create family')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleJoinFamily = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!joinFamilyId.trim()) {
      setError('Please enter the family ID')
      return
    }

    setIsSubmitting(true)
    try {
      // Add current user to the family_members table
      const response = await fetch('/api/family/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ family_id: joinFamilyId.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join family')
      }

      setFamilyId(joinFamilyId.trim())
      setProfileData({ ...profileData, family_id: joinFamilyId.trim() })
      setStep('profile')
    } catch (err) {
      console.error('Error joining family:', err)
      setError(err instanceof Error ? err.message : 'Failed to join family')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!profileData.email || !profileData.full_name || !profileData.role) {
      setError('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
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

      // Setup complete! Redirect to family page
      router.push('/dashboard/family')
    } catch (err) {
      console.error('Error creating profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to create profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step === 'family' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
              }`}
            >
              {step === 'profile' ? '✓' : '1'}
            </div>
            <div className="w-16 h-1 bg-gray-300">
              <div
                className={`h-full transition-all ${
                  step === 'profile' ? 'w-full bg-blue-600' : 'w-0 bg-gray-300'
                }`}
              />
            </div>
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step === 'profile' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}
            >
              2
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>Create Family</span>
            <span>Create Profile</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Step 1: Create or Join Family */}
        {step === 'family' && (
          <div className="bg-white shadow rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to Foodplan!
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Let's get started by setting up your family account.
            </p>

            {/* Mode Selection */}
            <div className="flex gap-2 mb-6">
              <button
                type="button"
                onClick={() => setSetupMode('create')}
                disabled={isSubmitting}
                className={`flex-1 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  setupMode === 'create'
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-600'
                    : 'bg-gray-100 text-gray-700 border-2 border-gray-200'
                }`}
              >
                Create New Family
              </button>
              <button
                type="button"
                onClick={() => setSetupMode('join')}
                disabled={isSubmitting}
                className={`flex-1 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  setupMode === 'join'
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-600'
                    : 'bg-gray-100 text-gray-700 border-2 border-gray-200'
                }`}
              >
                Join Existing Family
              </button>
            </div>

            {/* Create Family Form */}
            {setupMode === 'create' && (
              <form onSubmit={handleCreateFamily} className="space-y-4">
                <div>
                  <label
                    htmlFor="familyName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Family Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="familyName"
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., The Smith Family"
                    disabled={isSubmitting}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Choose a name that represents your household
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating...' : 'Continue'}
                </button>
              </form>
            )}

            {/* Join Family Form */}
            {setupMode === 'join' && (
              <form onSubmit={handleJoinFamily} className="space-y-4">
                <div>
                  <label
                    htmlFor="joinFamilyId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Family ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="joinFamilyId"
                    value={joinFamilyId}
                    onChange={(e) => setJoinFamilyId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Paste Family ID here"
                    disabled={isSubmitting}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter the Family ID shared by your partner
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-800">
                    Your partner should have received a Family ID after creating the family.
                    If you don't have it, ask them to check the "Invite Parent" button on
                    the Family Profiles page.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Joining...' : 'Continue'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Step 2: Create Profile */}
        {step === 'profile' && (
          <div className="bg-white shadow rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Create Your Profile
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Add your personal dietary information. You can add other family members later.
            </p>

            <form onSubmit={handleCreateProfile} className="space-y-4">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="full_name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="full_name"
                  value={profileData.full_name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, full_name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your name"
                  disabled={isSubmitting}
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your@email.com"
                  disabled={isSubmitting}
                />
              </div>

              {/* Role */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Your Role <span className="text-red-500">*</span>
                </label>
                <select
                  id="role"
                  value={profileData.role || ''}
                  onChange={(e) =>
                    setProfileData({ ...profileData, role: e.target.value as any })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                >
                  <option value="">Select your role</option>
                  <option value="husband">Husband</option>
                  <option value="wife">Wife</option>
                  <option value="child1">Child 1</option>
                  <option value="child2">Child 2</option>
                </select>
              </div>

              {/* Dietary Restrictions */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Dietary Restrictions
                </h4>

                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={profileData.is_gluten_free}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          is_gluten_free: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      disabled={isSubmitting}
                    />
                    <span className="ml-2 text-sm text-gray-700">Gluten-free</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={profileData.has_nut_allergy}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          has_nut_allergy: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      disabled={isSubmitting}
                    />
                    <span className="ml-2 text-sm text-gray-700">Nut allergy</span>
                  </label>

                  {profileData.has_nut_allergy && (
                    <div className="ml-6">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={profileData.can_eat_almonds}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              can_eat_almonds: e.target.checked,
                            })
                          }
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          disabled={isSubmitting}
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Can eat almonds
                        </span>
                      </label>
                    </div>
                  )}

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={profileData.avoid_saturated_fat}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          avoid_saturated_fat: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      disabled={isSubmitting}
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Avoid saturated fat
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={profileData.avoid_potatoes}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          avoid_potatoes: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      disabled={isSubmitting}
                    />
                    <span className="ml-2 text-sm text-gray-700">Avoid potatoes</span>
                  </label>

                  {profileData.avoid_potatoes && (
                    <div className="ml-6">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={profileData.can_eat_sweet_potatoes}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              can_eat_sweet_potatoes: e.target.checked,
                            })
                          }
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          disabled={isSubmitting}
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Can eat sweet potatoes
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep('family')}
                  disabled={isSubmitting}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating...' : 'Complete Setup'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
