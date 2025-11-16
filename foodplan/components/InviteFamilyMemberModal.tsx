'use client'

import { useState } from 'react'

interface InviteFamilyMemberModalProps {
  familyId: string
  onClose: () => void
}

/**
 * Invite Family Member Modal
 *
 * For MVP: Shows the family ID that the other parent can use during signup
 * Future enhancement: Send email invitation with magic link
 */
export default function InviteFamilyMemberModal({
  familyId,
  onClose,
}: InviteFamilyMemberModalProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyFamilyId = () => {
    navigator.clipboard.writeText(familyId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            Invite Family Member
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Share this Family ID with your partner so they can join your family
            during their account setup.
          </p>

          {/* Family ID Display */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <label className="block text-xs font-medium text-gray-500 mb-2">
              Family ID
            </label>
            <div className="flex items-center justify-between gap-2">
              <code className="flex-1 text-sm font-mono text-gray-900 break-all">
                {familyId}
              </code>
              <button
                onClick={handleCopyFamilyId}
                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              Instructions for your partner:
            </h4>
            <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
              <li>Sign up for a new account at the signup page</li>
              <li>During the family setup step, they should use this Family ID instead of creating a new family</li>
              <li>Once they join, they'll have access to all family profiles and can add/edit them</li>
            </ol>
          </div>

          {/* Note */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-yellow-900 mb-1">
                  Note
                </h4>
                <p className="text-sm text-yellow-800">
                  In the current MVP version, your partner needs to manually enter
                  this Family ID. Future versions will support email invitations
                  with automatic linking.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
