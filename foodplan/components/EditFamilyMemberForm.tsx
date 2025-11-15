'use client'

import { useState, useEffect } from 'react'
import type { UserRole, UserProfile } from '@/types'

interface EditFamilyMemberFormProps {
  profile: UserProfile
  onSubmit: (id: string, updates: Partial<UserProfile>) => Promise<void>
  onCancel: () => void
  usedRoles: UserRole[]
}

export default function EditFamilyMemberForm({
  profile,
  onSubmit,
  onCancel,
  usedRoles,
}: EditFamilyMemberFormProps) {
  const [formData, setFormData] = useState({
    email: profile.email,
    full_name: profile.full_name || '',
    role: profile.role,
    is_gluten_free: profile.is_gluten_free,
    has_nut_allergy: profile.has_nut_allergy,
    can_eat_almonds: profile.can_eat_almonds,
    avoid_saturated_fat: profile.avoid_saturated_fat,
    avoid_potatoes: profile.avoid_potatoes,
    can_eat_sweet_potatoes: profile.can_eat_sweet_potatoes,
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const roles: { value: UserRole; label: string }[] = [
    { value: 'husband', label: 'Husband' },
    { value: 'wife', label: 'Wife' },
    { value: 'child1', label: 'Child 1' },
    { value: 'child2', label: 'Child 2' },
  ]

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.full_name?.trim()) {
      newErrors.full_name = 'Full name is required'
    }

    if (!formData.role) {
      newErrors.role = 'Role is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(profile.id, formData)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Edit Family Member
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            value={formData.full_name}
            onChange={(e) =>
              setFormData({ ...formData, full_name: e.target.value })
            }
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.full_name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter full name"
          />
          {errors.full_name && (
            <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
          )}
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
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="email@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Role */}
        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Family Role <span className="text-red-500">*</span>
          </label>
          <select
            id="role"
            value={formData.role || ''}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value as UserRole })
            }
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.role ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select a role</option>
            {roles.map((role) => {
              const isUsed =
                usedRoles.includes(role.value) && role.value !== profile.role
              return (
                <option
                  key={role.value}
                  value={role.value}
                  disabled={isUsed}
                >
                  {role.label} {isUsed ? '(taken)' : ''}
                </option>
              )
            })}
          </select>
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role}</p>
          )}
        </div>

        {/* Dietary Restrictions */}
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Dietary Restrictions
          </h4>

          <div className="space-y-3">
            {/* Gluten-free */}
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_gluten_free}
                onChange={(e) =>
                  setFormData({ ...formData, is_gluten_free: e.target.checked })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Gluten-free</span>
            </label>

            {/* Nut allergy */}
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.has_nut_allergy}
                onChange={(e) =>
                  setFormData({ ...formData, has_nut_allergy: e.target.checked })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Nut allergy</span>
            </label>

            {/* Can eat almonds (conditional) */}
            {formData.has_nut_allergy && (
              <div className="ml-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.can_eat_almonds}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        can_eat_almonds: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Can eat almonds
                  </span>
                </label>
              </div>
            )}

            {/* Avoid saturated fat */}
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.avoid_saturated_fat}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    avoid_saturated_fat: e.target.checked,
                  })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                Avoid saturated fat
              </span>
            </label>

            {/* Avoid potatoes */}
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.avoid_potatoes}
                onChange={(e) =>
                  setFormData({ ...formData, avoid_potatoes: e.target.checked })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Avoid potatoes</span>
            </label>

            {/* Can eat sweet potatoes (conditional) */}
            {formData.avoid_potatoes && (
              <div className="ml-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.can_eat_sweet_potatoes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        can_eat_sweet_potatoes: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Can eat sweet potatoes
                  </span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
