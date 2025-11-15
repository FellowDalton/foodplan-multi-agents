-- Migration: Fix User Profiles for Family Sharing
-- Description: Enables two parent accounts to manage all 4 family member profiles
-- This modifies the schema to support Option 3: Two parent auth accounts managing shared family profiles
-- Author: Claude Code
-- Date: 2025-11-15

-- ====================
-- STEP 1: CREATE FAMILIES TABLE
-- ====================

CREATE TABLE IF NOT EXISTS families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE families IS 'Families that contain multiple user profiles';
COMMENT ON COLUMN families.name IS 'Family name (e.g., "The Smith Family")';

-- ====================
-- STEP 2: CREATE FAMILY_MEMBERS JUNCTION TABLE
-- ====================

CREATE TABLE IF NOT EXISTS family_members (
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('parent', 'admin')) DEFAULT 'parent',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (family_id, user_id)
);

COMMENT ON TABLE family_members IS 'Links auth accounts (parents) to families they can manage';
COMMENT ON COLUMN family_members.role IS 'Access role: parent (default) or admin';
COMMENT ON COLUMN family_members.user_id IS 'References auth.users - typically husband and wife accounts';

-- ====================
-- STEP 3: MODIFY USER_PROFILES TABLE
-- ====================

-- Check if the table needs migration (if it still has the old constraint)
DO $$
BEGIN
  -- Drop the old primary key constraint if it exists
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'user_profiles_pkey'
    AND conrelid = 'user_profiles'::regclass
    AND contype = 'p'
    AND array_length(conkey, 1) = 1
    AND EXISTS (
      SELECT 1 FROM pg_attribute
      WHERE attrelid = 'user_profiles'::regclass
      AND attnum = conkey[1]
      AND attname = 'id'
    )
  ) THEN
    -- First, check if the id column is a foreign key to auth.users
    IF EXISTS (
      SELECT 1 FROM pg_constraint
      WHERE conrelid = 'user_profiles'::regclass
      AND contype = 'f'
      AND confrelid = 'auth.users'::regclass
    ) THEN
      -- Drop the foreign key constraint
      ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_id_fkey;
      RAISE NOTICE 'Dropped foreign key constraint user_profiles_id_fkey';
    END IF;

    -- Drop the primary key
    ALTER TABLE user_profiles DROP CONSTRAINT user_profiles_pkey;
    RAISE NOTICE 'Dropped old primary key constraint';

    -- Make id column auto-generate UUIDs if it doesn't already
    ALTER TABLE user_profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();

    -- Add family_id column if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'user_profiles'
      AND column_name = 'family_id'
    ) THEN
      ALTER TABLE user_profiles ADD COLUMN family_id UUID REFERENCES families(id) ON DELETE CASCADE;
      RAISE NOTICE 'Added family_id column';
    END IF;

    -- Add new primary key on id
    ALTER TABLE user_profiles ADD PRIMARY KEY (id);
    RAISE NOTICE 'Added new primary key on id column';
  ELSE
    RAISE NOTICE 'user_profiles table already migrated or has custom structure';
  END IF;
END $$;

-- Add index for family lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_family_id ON user_profiles(family_id);

COMMENT ON COLUMN user_profiles.family_id IS 'Links profile to a family - multiple profiles can share the same family_id';
COMMENT ON COLUMN user_profiles.id IS 'Auto-generated UUID, no longer tied to auth.users';

-- ====================
-- STEP 4: UPDATE MEAL_PLANS TABLE
-- ====================

-- Add family_id to meal_plans (they belong to families, not individual profiles)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'meal_plans'
    AND column_name = 'family_id'
  ) THEN
    ALTER TABLE meal_plans ADD COLUMN family_id UUID REFERENCES families(id) ON DELETE CASCADE;
    RAISE NOTICE 'Added family_id to meal_plans';
  END IF;
END $$;

-- Create index for family meal plans
CREATE INDEX IF NOT EXISTS idx_meal_plans_family_id ON meal_plans(family_id);

-- Keep user_id for backwards compatibility but make it optional
-- Future inserts should use family_id instead
ALTER TABLE meal_plans ALTER COLUMN user_id DROP NOT NULL;

COMMENT ON COLUMN meal_plans.family_id IS 'Meal plans belong to families, not individual users';
COMMENT ON COLUMN meal_plans.user_id IS 'DEPRECATED: Use family_id instead. Kept for backwards compatibility';

-- ====================
-- STEP 5: UPDATE SHOPPING_LISTS TABLE
-- ====================

-- Add family_id to shopping_lists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shopping_lists'
    AND column_name = 'family_id'
  ) THEN
    ALTER TABLE shopping_lists ADD COLUMN family_id UUID REFERENCES families(id) ON DELETE CASCADE;
    RAISE NOTICE 'Added family_id to shopping_lists';
  END IF;
END $$;

-- Create index for family shopping lists
CREATE INDEX IF NOT EXISTS idx_shopping_lists_family_id ON shopping_lists(family_id);

-- Keep user_id for backwards compatibility but make it optional
ALTER TABLE shopping_lists ALTER COLUMN user_id DROP NOT NULL;

COMMENT ON COLUMN shopping_lists.family_id IS 'Shopping lists belong to families, not individual users';
COMMENT ON COLUMN shopping_lists.user_id IS 'DEPRECATED: Use family_id instead. Kept for backwards compatibility';

-- ====================
-- STEP 6: UPDATE ROW LEVEL SECURITY POLICIES
-- ====================

-- Enable RLS on new tables
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;

-- Drop old user_profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;

-- New user_profiles policies: Family members can access all profiles in their family
CREATE POLICY "Family members can view family profiles"
  ON user_profiles FOR SELECT
  USING (
    family_id IN (
      SELECT family_id FROM family_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Family members can manage family profiles"
  ON user_profiles FOR ALL
  USING (
    family_id IN (
      SELECT family_id FROM family_members WHERE user_id = auth.uid()
    )
  );

-- Families policies: Members can view their own family
CREATE POLICY "Family members can view their family"
  ON families FOR SELECT
  USING (
    id IN (
      SELECT family_id FROM family_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Family members can update their family"
  ON families FOR UPDATE
  USING (
    id IN (
      SELECT family_id FROM family_members WHERE user_id = auth.uid()
    )
  );

-- Family members policies: Can view and manage family membership
CREATE POLICY "Family members can view family membership"
  ON family_members FOR SELECT
  USING (
    family_id IN (
      SELECT family_id FROM family_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Family members can add other members"
  ON family_members FOR INSERT
  WITH CHECK (
    family_id IN (
      SELECT family_id FROM family_members WHERE user_id = auth.uid()
    )
  );

-- Drop old meal_plans policies
DROP POLICY IF EXISTS "Users can view their own meal plans" ON meal_plans;
DROP POLICY IF EXISTS "Users can create their own meal plans" ON meal_plans;
DROP POLICY IF EXISTS "Users can update their own meal plans" ON meal_plans;
DROP POLICY IF EXISTS "Users can delete their own meal plans" ON meal_plans;

-- New meal_plans policies: Family-based access
CREATE POLICY "Family members can view family meal plans"
  ON meal_plans FOR SELECT
  USING (
    -- Support both old user_id and new family_id
    (user_id = auth.uid()) OR
    (family_id IN (
      SELECT family_id FROM family_members WHERE user_id = auth.uid()
    ))
  );

CREATE POLICY "Family members can create family meal plans"
  ON meal_plans FOR INSERT
  WITH CHECK (
    -- Support both old user_id and new family_id
    (user_id = auth.uid()) OR
    (family_id IN (
      SELECT family_id FROM family_members WHERE user_id = auth.uid()
    ))
  );

CREATE POLICY "Family members can update family meal plans"
  ON meal_plans FOR UPDATE
  USING (
    (user_id = auth.uid()) OR
    (family_id IN (
      SELECT family_id FROM family_members WHERE user_id = auth.uid()
    ))
  );

CREATE POLICY "Family members can delete family meal plans"
  ON meal_plans FOR DELETE
  USING (
    (user_id = auth.uid()) OR
    (family_id IN (
      SELECT family_id FROM family_members WHERE user_id = auth.uid()
    ))
  );

-- Drop old shopping_lists policies
DROP POLICY IF EXISTS "Users can view their own shopping lists" ON shopping_lists;
DROP POLICY IF EXISTS "Users can create their own shopping lists" ON shopping_lists;
DROP POLICY IF EXISTS "Users can update their own shopping lists" ON shopping_lists;
DROP POLICY IF EXISTS "Users can delete their own shopping lists" ON shopping_lists;

-- New shopping_lists policies: Family-based access
CREATE POLICY "Family members can view family shopping lists"
  ON shopping_lists FOR SELECT
  USING (
    (user_id = auth.uid()) OR
    (family_id IN (
      SELECT family_id FROM family_members WHERE user_id = auth.uid()
    ))
  );

CREATE POLICY "Family members can create family shopping lists"
  ON shopping_lists FOR INSERT
  WITH CHECK (
    (user_id = auth.uid()) OR
    (family_id IN (
      SELECT family_id FROM family_members WHERE user_id = auth.uid()
    ))
  );

CREATE POLICY "Family members can update family shopping lists"
  ON shopping_lists FOR UPDATE
  USING (
    (user_id = auth.uid()) OR
    (family_id IN (
      SELECT family_id FROM family_members WHERE user_id = auth.uid()
    ))
  );

CREATE POLICY "Family members can delete family shopping lists"
  ON shopping_lists FOR DELETE
  USING (
    (user_id = auth.uid()) OR
    (family_id IN (
      SELECT family_id FROM family_members WHERE user_id = auth.uid()
    ))
  );

-- Note: Recipes remain tied to user_profiles (unchanged)
-- Note: meal_plan_items and shopping_list_items inherit access through their parent tables

-- ====================
-- STEP 7: ADD TRIGGERS FOR NEW TABLES
-- ====================

CREATE TRIGGER update_families_updated_at
  BEFORE UPDATE ON families
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ====================
-- MIGRATION COMPLETE
-- ====================

-- Summary of changes:
-- 1. Created families table to group user profiles
-- 2. Created family_members junction table to link auth accounts to families
-- 3. Modified user_profiles to be independent entities with family_id
-- 4. Updated meal_plans and shopping_lists to reference families
-- 5. Updated all RLS policies to support family-based access
-- 6. Maintained backwards compatibility with old user_id columns

-- Next steps for application code:
-- 1. When a parent signs up, create a family and add them as a family_member
-- 2. Create 4 user_profiles (husband, wife, child1, child2) with the family_id
-- 3. When the other parent signs up, add them to the existing family via family_members
-- 4. Use family_id when creating meal_plans and shopping_lists
-- 5. Both parents can now view/edit all profiles, meal plans, and shopping lists

-- Example usage:
-- INSERT INTO families (name) VALUES ('The Smith Family') RETURNING id;
-- INSERT INTO family_members (family_id, user_id, role) VALUES (<family_id>, auth.uid(), 'parent');
-- INSERT INTO user_profiles (family_id, role, email, ...) VALUES (<family_id>, 'husband', 'john@example.com', ...);
