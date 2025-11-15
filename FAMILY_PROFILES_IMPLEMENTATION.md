# Family Profiles Implementation Summary

## Overview

This implementation enables two parent accounts to manage all 4 family member profiles (husband, wife, child1, child2) using the new family sharing schema.

## Schema Changes

The migration file `supabase/migrations/fix_user_profiles_for_family_sharing.sql` implements:

1. **families table** - Groups all user profiles together
2. **family_members junction table** - Links parent auth accounts to families
3. **Updated user_profiles table** - Now has `family_id` instead of being tied to auth.users
4. **Updated RLS policies** - Family-based access control

**IMPORTANT:** The migration has been created but NOT run yet. You need to apply it to your Supabase database.

## Architecture

### Family Sharing Model (Option 3)

```
Parent 1 (auth.users) ─┐
                       ├─→ family_members ─→ Family ─→ user_profiles (4)
Parent 2 (auth.users) ─┘                                ├─ Husband
                                                        ├─ Wife
                                                        ├─ Child 1
                                                        └─ Child 2
```

- **Two parent accounts** can both view/edit all 4 profiles
- **RLS policies** enforce access at database level
- **family_id** links everything together

## Files Created/Updated

### API Routes

1. **`/app/api/family/route.ts`** (NEW)
   - GET: Fetch user's family information
   - POST: Create new family (for first-time setup)

2. **`/app/api/family/members/route.ts`** (NEW)
   - GET: Get all parent accounts in the family
   - POST: Generate invite for second parent (MVP: returns family ID)

3. **`/app/api/family/join/route.ts`** (NEW)
   - POST: Join an existing family using family ID
   - Validates family exists and has space for another parent
   - Adds user to family_members table

4. **`/app/api/profiles/route.ts`** (UPDATED)
   - GET: Fetch all profiles for user's family (uses family_id from family_members)
   - POST: Create profile (automatically adds user's family_id)
   - Validates max 4 profiles per family
   - Prevents duplicate roles within family

5. **`/app/api/profiles/[id]/route.ts`** (UPDATED)
   - GET, PATCH, DELETE: All enforce family-based access
   - Role validation ensures no duplicates within family
   - Prevents changing family_id

### Pages

1. **`/app/dashboard/setup/page.tsx`** (NEW)
   - First-time setup flow for new users
   - Step 1: Create NEW family OR Join EXISTING family
     - Create: Enter family name
     - Join: Enter family ID shared by partner
   - Step 2: Create your profile
   - Redirects to family page when complete

2. **`/app/dashboard/family/page.tsx`** (UPDATED)
   - Checks if user has family (redirects to setup if not)
   - Displays family name in header
   - Shows all family profiles
   - Add/Edit/Delete profiles
   - Invite other parent button

### Components

1. **`/components/InviteFamilyMemberModal.tsx`** (NEW)
   - Modal to invite second parent
   - Displays family ID for sharing
   - Copy to clipboard functionality
   - Instructions for partner to join

2. **`/components/AddFamilyMemberForm.tsx`** (UPDATED)
   - No longer needs family_id prop (API adds it automatically)
   - Updated TypeScript types

3. **`/components/FamilyMemberCard.tsx`** (NO CHANGES NEEDED)
   - Already displays profiles correctly

4. **`/components/EditFamilyMemberForm.tsx`** (NO CHANGES NEEDED)
   - Already works with new schema

## User Flows

### First-Time User (Parent 1)

1. Sign up and authenticate
2. Redirected to `/dashboard/setup`
3. Create family (e.g., "The Smith Family")
4. Create first profile (e.g., Husband)
5. Redirected to `/dashboard/family`
6. Can add remaining profiles (Wife, Child 1, Child 2)
7. Click "Invite Parent" to get family ID

### Second Parent Joining

**FULLY IMPLEMENTED:**

1. Parent 1 clicks "Invite Parent" button
2. Parent 1 copies Family ID from modal
3. Parent 1 shares Family ID with Parent 2 (via text, email, etc.)
4. Parent 2 signs up for new account
5. During setup, Parent 2:
   - Clicks "Join Existing Family" tab
   - Pastes Family ID
   - Clicks Continue
   - Creates their profile
6. Both parents now have access to all family profiles!

### Adding/Editing Profiles

1. Both parents see the same family profiles page
2. Click "Add Family Member"
3. Fill in details (name, email, role, dietary restrictions)
4. API automatically uses the parent's family_id
5. Profile appears for both parents immediately

### Dietary Restrictions

Each profile supports:
- Gluten-free (checkbox)
- Nut allergy (checkbox)
  - If yes: Can eat almonds? (sub-checkbox)
- Avoid saturated fat (checkbox)
- Avoid potatoes (checkbox)
  - If yes: Can eat sweet potatoes? (sub-checkbox)

## Validation & Constraints

1. **Maximum 4 profiles per family** (husband, wife, child1, child2)
2. **No duplicate roles** within a family
3. **Maximum 2 parent accounts** per family
4. **RLS policies** prevent cross-family access
5. **Required fields**: email, full name, role

## API Response Examples

### GET /api/family
```json
{
  "family": {
    "id": "uuid",
    "name": "The Smith Family",
    "created_at": "2025-11-15T...",
    "updated_at": "2025-11-15T..."
  },
  "role": "parent"
}
```

### GET /api/profiles
```json
{
  "profiles": [
    {
      "id": "uuid",
      "family_id": "uuid",
      "email": "john@example.com",
      "full_name": "John Smith",
      "role": "husband",
      "is_gluten_free": true,
      "has_nut_allergy": false,
      "can_eat_almonds": true,
      "avoid_saturated_fat": false,
      "avoid_potatoes": false,
      "can_eat_sweet_potatoes": true,
      "created_at": "...",
      "updated_at": "..."
    },
    // ... more profiles
  ]
}
```

## Testing Instructions

### 1. Run the Migration

```bash
cd foodplan/supabase
# Apply migration to your Supabase database
supabase migration up
# Or apply via Supabase dashboard
```

### 2. Test First-Time Setup

1. Sign up with a new account
2. Verify redirect to `/dashboard/setup`
3. Create a family
4. Create first profile
5. Verify redirect to `/dashboard/family`

### 3. Test Adding Profiles

1. Add all 4 profiles (husband, wife, child1, child2)
2. Verify role validation (no duplicates)
3. Verify max 4 profiles limit
4. Test dietary restrictions (conditional fields)

### 4. Test Edit/Delete

1. Edit a profile
2. Change role to one that's available
3. Try changing to taken role (should fail)
4. Delete a profile
5. Verify it's removed

### 5. Test Invite Feature

1. Click "Invite Parent"
2. Copy family ID
3. Verify instructions are clear

### 6. Test Second Parent Flow

1. Parent 1 clicks "Invite Parent" button
2. Copy the Family ID
3. Sign out and create a new account for Parent 2
4. During Parent 2 setup:
   - Click "Join Existing Family" tab
   - Paste the Family ID
   - Click Continue
5. Create Parent 2's profile
6. Verify both accounts can see all profiles
7. Test that Parent 2 can add/edit/delete profiles

## Known Limitations & Future Enhancements

### Current Limitations

1. **No automatic invite system** - Family ID must be shared manually (via text, email, etc.)
2. **No email invitations** - Future: send magic link via email with one-click joining
3. **No family switching** - Users can only belong to one family at a time
4. **No role-based permissions** - Both parents have equal access (no admin vs parent distinction)

### Future Enhancements

1. **Email invitation system**
   - Send invite with magic link via email
   - One-click joining (no need to copy/paste family ID)
   - Track invitation status (pending, accepted, expired)

2. **Family admin roles**
   - Distinguish between parent and admin
   - Admin can remove parents

3. **Multiple families**
   - Support users in multiple families (e.g., divorced parents)

4. **Profile photos**
   - Upload images for each family member

5. **Audit log**
   - Track who made changes to profiles

## Error Handling

All API routes include:
- Authentication checks (401 Unauthorized)
- Family membership validation (403 Forbidden)
- Input validation (400 Bad Request)
- Database error handling (500 Internal Server Error)
- Helpful error messages

## Security

- **RLS policies** enforce family-based access at database level
- **No cross-family access** - Users can only see their own family
- **Auth required** - All endpoints check authentication
- **Input validation** - Prevent invalid data
- **Safe defaults** - Dietary restrictions default to safe values

## Database Migration Steps

1. **Backup your database** before running migration
2. Apply migration: `supabase migration up` or via dashboard
3. **Verify tables created**: families, family_members
4. **Verify user_profiles updated**: has family_id column
5. **Test RLS policies**: Try accessing other family's data (should fail)

## Build Status

✅ **Build successful** - All TypeScript types correct
✅ **No linting errors** - Code follows best practices
✅ **All routes registered** - API endpoints available
✅ **Components rendered** - UI pages load correctly

## Next Steps

1. **Run the database migration** (see Database Migration Steps)
2. **Test the first-time setup flow** (create new family)
3. **Test the join family flow** (second parent)
4. **Test with two parent accounts** (verify both can see/edit all profiles)
5. **Add email invitation system** (future enhancement)

---

**Implementation completed by:** Coder Agent
**Date:** 2025-11-15
**Status:** Ready for testing (after migration)
