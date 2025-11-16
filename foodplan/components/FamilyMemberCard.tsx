'use client'

import type { UserProfile } from '@/types'

interface FamilyMemberCardProps {
  profile: UserProfile
  onEdit: (profile: UserProfile) => void
  onDelete: (profile: UserProfile) => void
}

export default function FamilyMemberCard({
  profile,
  onEdit,
  onDelete,
}: FamilyMemberCardProps) {
  const roleLabels = {
    husband: 'Husband',
    wife: 'Wife',
    child1: 'Child 1',
    child2: 'Child 2',
  }

  // Collect dietary restrictions
  const restrictions: string[] = []
  if (profile.is_gluten_free) restrictions.push('Gluten-free')
  if (profile.has_nut_allergy) {
    if (profile.can_eat_almonds) {
      restrictions.push('Nut allergy (can eat almonds)')
    } else {
      restrictions.push('Nut allergy')
    }
  }
  if (profile.avoid_saturated_fat) restrictions.push('Avoid saturated fat')
  if (profile.avoid_potatoes) {
    if (profile.can_eat_sweet_potatoes) {
      restrictions.push('Avoid potatoes (can eat sweet potatoes)')
    } else {
      restrictions.push('Avoid potatoes')
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {profile.full_name || 'Unnamed'}
          </h3>
          <p className="text-sm text-gray-500">
            {roleLabels[profile.role as keyof typeof roleLabels] || profile.role}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(profile)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            aria-label={`Edit ${profile.full_name || 'profile'}`}
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(profile)}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
            aria-label={`Delete ${profile.full_name || 'profile'}`}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <label className="text-xs font-medium text-gray-500">Email</label>
          <p className="text-sm text-gray-900">{profile.email}</p>
        </div>

        {restrictions.length > 0 && (
          <div>
            <label className="text-xs font-medium text-gray-500">
              Dietary Restrictions
            </label>
            <div className="mt-1 flex flex-wrap gap-2">
              {restrictions.map((restriction, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {restriction}
                </span>
              ))}
            </div>
          </div>
        )}

        {restrictions.length === 0 && (
          <div>
            <label className="text-xs font-medium text-gray-500">
              Dietary Restrictions
            </label>
            <p className="text-sm text-gray-400 italic">None</p>
          </div>
        )}
      </div>
    </div>
  )
}
