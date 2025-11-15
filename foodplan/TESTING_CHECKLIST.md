# Foodplan MVP Testing Checklist

Complete guide to test all features of your foodplan web app.

## Prerequisites Setup

### 1. Database Migrations ⚠️ REQUIRED

Run these migrations in your Supabase SQL Editor (https://app.supabase.com → SQL Editor):

**Migration 1: Core Meal Planning Schema**
- File: `/foodplan/supabase/migrations/add_meal_planning_schema.sql`
- Creates: user_profiles, recipes, meal_plans, meal_plan_items, shopping_lists, shopping_list_items
- Status: ☐ Not run | ☑ Completed

**Migration 2: Family Sharing Schema**
- File: `/foodplan/supabase/migrations/fix_user_profiles_for_family_sharing.sql`
- Updates: Adds families table, family_members junction table, modifies user_profiles
- Status: ☐ Not run | ☑ Completed

### 2. Environment Variables ⚠️ REQUIRED

Create `/foodplan/.env.local` with your credentials:

```bash
# Supabase (get from https://app.supabase.com → Project Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Anthropic (get from https://console.anthropic.com/)
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Status: ☐ Not configured | ☑ Configured

### 3. Start Development Server

```bash
cd /home/user/foodplan-multi-agents/foodplan
npm run dev
```

Navigate to: http://localhost:3000

Status: ☐ Not started | ☑ Running

---

## Phase 1: Authentication & Family Setup

### Test 1.1: Sign Up (Parent 1 - You)
- [ ] Navigate to http://localhost:3000
- [ ] Click "Sign Up" button
- [ ] Enter email: your-email@example.com
- [ ] Enter password (min 6 characters)
- [ ] Submit form
- [ ] ✅ Should redirect to `/dashboard/setup`
- [ ] ✅ Should see "Setup Your Family" page

**Issues found:** _______________

### Test 1.2: Create Family
- [ ] On setup page, verify "Create New Family" tab is selected
- [ ] Enter family name: "The [YourName] Family"
- [ ] Click "Continue"
- [ ] ✅ Should proceed to Step 2: "Create Your Profile"
- [ ] ✅ Should see progress indicator showing step 2/2

**Issues found:** _______________

### Test 1.3: Create Parent 1 Profile
- [ ] Full name: Your name
- [ ] Role: Select "Husband" or "Wife"
- [ ] Email: Should be pre-filled with your auth email
- [ ] Check dietary restrictions:
  - [ ] Gluten-free: ☑ Yes
  - [ ] Nut allergy: ☑ Yes (if you're the husband)
  - [ ] Can eat almonds: ☑ Yes (if nut allergy checked)
  - [ ] Avoid saturated fat: ☑ Yes (if you're the wife)
  - [ ] Avoid potatoes: ☑ Yes (if you're the wife)
  - [ ] Can eat sweet potatoes: ☑ Yes (if avoid potatoes checked)
- [ ] Click "Complete Setup"
- [ ] ✅ Should redirect to `/dashboard/family`
- [ ] ✅ Should see your profile displayed

**Issues found:** _______________

### Test 1.4: Add Remaining Family Members
- [ ] Click "Add Family Member" button
- [ ] Add profile for spouse (opposite role from step 1.3)
- [ ] Add profile for "child1"
- [ ] Add profile for "child2"
- [ ] ✅ Should have 4 profiles total (husband, wife, child1, child2)
- [ ] ✅ "Add Family Member" button should be disabled (max 4 reached)
- [ ] ✅ Verify dietary badges display correctly on each profile

**Issues found:** _______________

### Test 1.5: Invite Parent 2 (Your Wife)
- [ ] Click "Invite Parent" button at top
- [ ] ✅ Modal should show Family ID
- [ ] Copy the Family ID
- [ ] ✅ Should see clear instructions for partner to join

**Copied Family ID:** _______________

**Issues found:** _______________

### Test 1.6: Sign Up Parent 2 (Optional - Test Multi-Parent Access)
- [ ] Open incognito/private browser window
- [ ] Navigate to http://localhost:3000
- [ ] Sign up with different email
- [ ] On setup page, click "Join Existing Family" tab
- [ ] Paste the Family ID from Test 1.5
- [ ] Click "Continue"
- [ ] Create profile for parent 2
- [ ] ✅ Should see ALL 4 profiles from parent 1's account
- [ ] ✅ Should be able to edit/delete all profiles

**Issues found:** _______________

---

## Phase 2: Grocery Deals Dashboard

### Test 2.1: View Deals
- [ ] From dashboard, click "Grocery Deals" card
- [ ] ✅ Should navigate to `/dashboard/deals`
- [ ] ✅ Should see deals from 3 stores (Netto, Rema, Meny)
- [ ] ✅ Total deals shown: ~513
- [ ] ✅ Should see stats summary at top

**Total deals displayed:** _______________

**Issues found:** _______________

### Test 2.2: Filter by Store
- [ ] Click "Netto" tab
- [ ] ✅ Should show only Netto deals (~211)
- [ ] ✅ Deals should have yellow/black store branding
- [ ] Click "Rema 1000" tab
- [ ] ✅ Should show only Rema deals (~171)
- [ ] ✅ Deals should have blue store branding
- [ ] Click "Meny" tab
- [ ] ✅ Should show only Meny deals (~131)
- [ ] ✅ Deals should have red store branding

**Issues found:** _______________

### Test 2.3: Filter by Category
- [ ] Select "Meat & Poultry" from category dropdown
- [ ] ✅ Should filter to show only meat products
- [ ] Try other categories (Dairy, Vegetables, etc.)
- [ ] Click "All Categories" to reset

**Issues found:** _______________

### Test 2.4: Search Deals
- [ ] Enter "chicken" in search box
- [ ] ✅ Should filter to chicken products
- [ ] Try searching for "milk", "bread", "tomato"
- [ ] ✅ Search should be case-insensitive

**Issues found:** _______________

### Test 2.5: Sort Deals
- [ ] Select "Price (Low to High)" from sort dropdown
- [ ] ✅ Should sort by lowest price first
- [ ] Select "Price per Unit"
- [ ] ✅ Should sort by price per kg/liter
- [ ] Select "Name"
- [ ] ✅ Should sort alphabetically

**Issues found:** _______________

---

## Phase 3: AI Recipe Suggestions

### Test 3.1: Navigate to Recipe Suggestions
- [ ] From dashboard, click "AI Recipes" card
- [ ] ✅ Should navigate to `/dashboard/recipes/suggest`
- [ ] ✅ Should see family dietary restrictions summary at top
- [ ] ✅ Should see recipe suggestion form

**Dietary restrictions shown:** _______________

**Issues found:** _______________

### Test 3.2: Generate Recipes WITHOUT Deals
- [ ] Meal type: Select "Dinner"
- [ ] Cuisine: Select "Danish"
- [ ] Max cooking time: 60 minutes
- [ ] Number of recipes: 3
- [ ] Use current deals: ☐ Unchecked
- [ ] Click "Generate Recipes"
- [ ] ✅ Should show loading spinner
- [ ] ✅ Wait 10-20 seconds for Claude API
- [ ] ✅ Should display 3 recipe suggestions
- [ ] ✅ All recipes should have "GF" (gluten-free) badge
- [ ] ✅ No recipes should contain nuts (except almonds if allowed)
- [ ] ✅ Recipes should avoid saturated fat and potatoes

**Time to generate:** _____ seconds

**Issues found:** _______________

### Test 3.3: Generate Recipes WITH Deals
- [ ] Clear previous recipes (refresh page if needed)
- [ ] Meal type: Select "Dinner"
- [ ] Cuisine: Select "Any"
- [ ] Max cooking time: 45 minutes
- [ ] Number of recipes: 2
- [ ] Use current deals: ☑ Checked
- [ ] Click "Generate Recipes"
- [ ] ✅ Should generate recipes using sale ingredients
- [ ] ✅ Should highlight ingredients on sale (yellow border)
- [ ] ✅ Should show estimated cost

**On-sale ingredients highlighted:** _______________

**Issues found:** _______________

### Test 3.4: Save Recipe
- [ ] Click "Save Recipe" button on one of the generated recipes
- [ ] ✅ Button should show loading state
- [ ] ✅ Button should change to "Saved!" with checkmark
- [ ] ✅ Recipe should be saved to database

**Issues found:** _______________

---

## Phase 4: Weekly Meal Planner

### Test 4.1: Navigate to Meal Planner
- [ ] From dashboard, click "Meal Plans" card
- [ ] ✅ Should navigate to `/dashboard/meal-planner`
- [ ] ✅ Should show current week by default
- [ ] ✅ Should display week range (e.g., "Nov 18-24, 2025")
- [ ] ✅ Should show "Week X" number

**Current week shown:** _______________

**Issues found:** _______________

### Test 4.2: Create Meal Plan
- [ ] If no meal plan exists, click "Create Meal Plan"
- [ ] ✅ Should create meal plan automatically
- [ ] ✅ Should show 7-day × 3-meal grid (21 slots)
- [ ] ✅ Should see days: Monday - Sunday
- [ ] ✅ Should see meals: Breakfast, Lunch, Dinner
- [ ] ✅ Today's column should be highlighted

**Issues found:** _______________

### Test 4.3: Add Meals to Plan
- [ ] Click an empty "Dinner" slot for Monday
- [ ] ✅ Modal should open with recipe selector
- [ ] ✅ Should see saved recipes in the list
- [ ] Select a recipe from the modal
- [ ] ✅ Recipe should appear in the Monday Dinner slot
- [ ] ✅ Should show recipe name and dietary badges
- [ ] Repeat for several other meal slots
- [ ] ✅ Each added meal should show color coding:
  - Breakfast: yellow/orange
  - Lunch: green
  - Dinner: blue

**Meals added successfully:** _____ / 21

**Issues found:** _______________

### Test 4.4: Use Recipe Library Sidebar
- [ ] Look at the recipe library sidebar on the right
- [ ] ✅ Should show all saved recipes
- [ ] Try searching for a recipe in the search box
- [ ] ✅ Search should filter the recipe list
- [ ] Try filtering by dietary restrictions (GF, Nut-Free, Low Fat)
- [ ] ✅ Filters should work correctly

**Issues found:** _______________

### Test 4.5: Remove Meal from Plan
- [ ] Hover over a filled meal slot
- [ ] ✅ Should see X button appear
- [ ] Click the X button
- [ ] ✅ Meal should be removed from the slot
- [ ] ✅ Slot should show "Add meal" state again

**Issues found:** _______________

### Test 4.6: Navigate Between Weeks
- [ ] Click "Next week" arrow button
- [ ] ✅ Should show next week's dates
- [ ] ✅ Should create new meal plan for that week (or show empty)
- [ ] Click "Previous week" arrow button twice
- [ ] ✅ Should show previous week
- [ ] Click "Today" button
- [ ] ✅ Should jump back to current week

**Issues found:** _______________

---

## Phase 5: Shopping List (Google Keep Style)

### Test 5.1: Navigate to Shopping Lists
- [ ] From dashboard, click "Shopping Lists" card
- [ ] ✅ Should navigate to `/dashboard/shopping-lists`
- [ ] ✅ Should see "Create New List" button
- [ ] ✅ Should see "Generate from Meal Plan" button

**Issues found:** _______________

### Test 5.2: Generate Shopping List from Meal Plan
- [ ] Click "Generate from Meal Plan" button
- [ ] ✅ Modal should open with meal plan selector
- [ ] Select your current week's meal plan
- [ ] Click "Generate List"
- [ ] ✅ Should show loading state
- [ ] ✅ Should create new shopping list
- [ ] ✅ Should redirect to new list detail page
- [ ] ✅ Should see aggregated ingredients from all recipes
- [ ] ✅ Duplicate ingredients should be combined (e.g., multiple "chicken" entries → one "1.5kg chicken")

**Number of items in generated list:** _______________

**Example of aggregation working:** _______________

**Issues found:** _______________

### Test 5.3: Google Keep Features - Checkboxes
- [ ] ✅ Checkboxes should be LARGE (24×24px, easy to tap)
- [ ] Tap/click anywhere on an item row
- [ ] ✅ Item should be checked (checkbox filled)
- [ ] ✅ Item text should have strikethrough
- [ ] ✅ Item should move to bottom of list
- [ ] Tap/click the item again
- [ ] ✅ Item should be unchecked
- [ ] ✅ Item should move back to top

**Issues found:** _______________

### Test 5.4: Add Items Manually
- [ ] Look for "Add item" form at the top
- [ ] ✅ Form should be always visible
- [ ] Enter item name: "Extra milk"
- [ ] Enter quantity: "2"
- [ ] Select unit: "l"
- [ ] Select store: "Netto"
- [ ] Press Enter or click "Add"
- [ ] ✅ Item should be added to list
- [ ] ✅ Form should clear
- [ ] ✅ New item should appear at top

**Issues found:** _______________

### Test 5.5: Edit Item
- [ ] Click the pencil (edit) icon on an item
- [ ] ✅ Modal should open with item details
- [ ] Change the quantity
- [ ] Add a note
- [ ] Click "Save"
- [ ] ✅ Modal should close
- [ ] ✅ Item should update with new values

**Issues found:** _______________

### Test 5.6: Delete Item
- [ ] Click the trash icon on an item
- [ ] ✅ Item should be removed from list
- [ ] ✅ List should update immediately

**Issues found:** _______________

### Test 5.7: Filter Items
- [ ] Check off several items
- [ ] Click "Active" filter tab
- [ ] ✅ Should show only unchecked items
- [ ] Click "Completed" filter tab
- [ ] ✅ Should show only checked items
- [ ] Click "All" filter tab
- [ ] ✅ Should show all items

**Issues found:** _______________

### Test 5.8: Clear Completed Items
- [ ] Make sure several items are checked
- [ ] Click "Clear Completed" button
- [ ] ✅ All checked items should be removed
- [ ] ✅ Only unchecked items remain

**Issues found:** _______________

### Test 5.9: Edit List Title
- [ ] Click on the list title at top
- [ ] ✅ Should become editable input
- [ ] Change the title to "Weekly Groceries"
- [ ] Press Enter or click away
- [ ] ✅ Title should update
- [ ] ✅ Change should be saved automatically

**Issues found:** _______________

### Test 5.10: Create Manual Shopping List
- [ ] Navigate back to shopping lists page
- [ ] Click "Create New List"
- [ ] ✅ Should create empty list
- [ ] ✅ Should redirect to detail page
- [ ] Add several items manually
- [ ] ✅ Should work the same as generated list

**Issues found:** _______________

---

## Phase 6: Complete Workflow Integration

### Test 6.1: Full User Journey
- [ ] Start from dashboard
- [ ] View deals → pick some products you want
- [ ] Generate AI recipes → save 5+ recipes
- [ ] Create weekly meal plan → fill in 10+ meals
- [ ] Generate shopping list from meal plan
- [ ] Review shopping list → check off items as you "shop"
- [ ] ✅ Entire flow should work smoothly

**Time to complete full journey:** _____ minutes

**Issues found:** _______________

### Test 6.2: Second Parent Access (If Tested)
- [ ] Log in as parent 2 (from Test 1.6)
- [ ] ✅ Should see same family profiles
- [ ] ✅ Should see same meal plans
- [ ] ✅ Should see same shopping lists
- [ ] Make changes as parent 2
- [ ] ✅ Changes should be visible to parent 1

**Issues found:** _______________

---

## Phase 7: Mobile Responsiveness

### Test 7.1: Mobile View (Resize browser or use mobile device)
- [ ] Resize browser to mobile width (375px)
- [ ] Test all pages:
  - [ ] Dashboard
  - [ ] Family profiles
  - [ ] Deals dashboard
  - [ ] Recipe suggestions
  - [ ] Meal planner
  - [ ] Shopping lists
- [ ] ✅ All pages should be readable and usable on mobile
- [ ] ✅ Buttons should be easy to tap (48px+ touch targets)
- [ ] ✅ No horizontal scrolling
- [ ] ✅ Forms should work well on mobile

**Issues found:** _______________

---

## Phase 8: Error Handling & Edge Cases

### Test 8.1: Missing API Key
- [ ] Temporarily remove ANTHROPIC_API_KEY from .env.local
- [ ] Restart dev server
- [ ] Try to generate recipes
- [ ] ✅ Should show friendly error message about missing API key
- [ ] Restore API key

**Issues found:** _______________

### Test 8.2: Empty States
- [ ] Create a new week meal plan (don't add meals)
- [ ] ✅ Should show helpful empty state messages
- [ ] Try generating shopping list from empty meal plan
- [ ] ✅ Should handle gracefully

**Issues found:** _______________

### Test 8.3: Maximum Limits
- [ ] Try adding 5th family member
- [ ] ✅ Should prevent (max 4)
- [ ] Try adding 22nd meal to meal plan
- [ ] ✅ Should work (no limit on meals per week)

**Issues found:** _______________

---

## Summary

### Total Tests Passed: _____ / 80+

### Critical Issues (Blocking):
1. _______________
2. _______________
3. _______________

### Minor Issues (Non-blocking):
1. _______________
2. _______________
3. _______________

### Overall Assessment:
- [ ] ✅ READY FOR USE
- [ ] ⚠️ READY WITH MINOR ISSUES
- [ ] ❌ NEEDS FIXES BEFORE USE

### Notes:
_______________
_______________
_______________

---

## Next Steps After Testing

If all tests pass:
1. ✅ Start using the app for your family meal planning!
2. ✅ Run Python scrapers weekly to update deals
3. ✅ Share feedback or request enhancements

If issues found:
1. ❌ Document issues in this checklist
2. ❌ Report to developer (or fix yourself)
3. ❌ Re-test after fixes
