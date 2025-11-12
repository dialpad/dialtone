# Bug Fixes and Stability Improvements

**Date**: 2025-01-11
**Status**: ✅ Completed
**Related Branch**: `dialpad-design-hub`
**Part of**: Phases 14-15 following [Navigation Flattening](./02-navigation-flattening.md)

## Overview

After completing the navigation flattening, several critical bugs were discovered and fixed during testing. This document covers two phases of bug fixes that addressed build loops, navigation failures, styling issues, and race conditions.

## Phase 14: Initial Bug Fixes

### Issue 1: Icons Build Loop ✅

**Problem**: Dev server entered infinite rebuild loop
**Root Cause**: VuePress/Vite watching changes in `packages/dialtone-icons/dist`, creating circular dependency
**Solution**: Added Vite watch configuration to ignore packages directory

**File**: `docs/.vuepress/config.js`
```javascript
server: {
  watch: {
    ignored: ['**/packages/**', '**/node_modules/**']
  }
}
```

### Issue 2: Sidebar Toggle Navigation Error ✅

**Problem**: `TypeError: Cannot set properties of null (setting '__vnode')` when clicking collapsible sidebar items
**Root Cause**: Double toggle issue - both calling `listeners.onClick()` AND emitting toggle event
**Solution**: Simplified toggle logic to only emit to parent

**File**: `docs/.vuepress/theme/components/SidebarItem.vue`

### Issue 3: FOUC (Flash of Unstyled Content) on Homepage ✅

**Problem**: Homepage rendered without full styles on direct load
**Root Cause**: DP theme CSS imported asynchronously
**Solution**: Import DP theme synchronously and apply immediately

**File**: `docs/.vuepress/theme/client.js`

### Issue 4: Missing Navbar on Homepage ✅

**Problem**: Homepage missing entire navbar on initial load
**Root Cause**: Layout component had `v-if="!$frontmatter.home"` on navbar
**Solution**: Removed conditional - navbar should always be visible

**File**: `docs/.vuepress/theme/layouts/Layout.vue`

## Phase 15: Navigation Race Conditions

### Issue 5: Mobile Navigation Race Conditions ✅

**Problem**: URL changes but page content doesn't update when clicking navigation links

**Root Cause Analysis**:
1. **MobileNavbar.vue**: Used `setTimeout(..., 10)` - a timing hack that creates race conditions
2. **MobileSidebar.vue**: Synchronously manipulates DOM during navigation

**Solution**: Replace timing hacks with proper async navigation handling

**Key Changes**:
```javascript
// Before - setTimeout hack
const toggleNavbar = async () => {
  setTimeout(() => {
    isMenuOpen.value = !isMenuOpen.value;
    document.body.classList.toggle('d-of-hidden', !!isMenuOpen.value);
  }, 10);
};

// After - proper async handling
const toggleNavbar = async () => {
  await router.isReady();
  await nextTick();
  isMenuOpen.value = !isMenuOpen.value;
  document.body.classList.toggle('d-of-hidden', !!isMenuOpen.value);
};
```

**Key Improvements**:
1. **`router.isReady()`** - Ensures router has finished current navigation
2. **`nextTick()`** - Waits for Vue's DOM patching cycle to complete
3. **Async/await pattern** - Proper sequencing prevents race conditions
4. **No setTimeout** - Eliminates arbitrary timing

## Files Modified

### Phase 14
1. `docs/.vuepress/config.js` - Added Vite watch ignore
2. `docs/.vuepress/theme/components/SidebarItem.vue` - Fixed toggle logic
3. `docs/.vuepress/theme/client.js` - Synchronous theme loading
4. `docs/.vuepress/theme/layouts/Layout.vue` - Always show navbar

### Phase 15
1. `docs/.vuepress/theme/components/MobileNavbar.vue` - Removed setTimeout, added async guards
2. `docs/.vuepress/theme/components/MobileSidebar.vue` - Added async navigation guards

## Verification

✅ Dev server builds without loops
✅ No console errors during navigation
✅ Sidebar toggles work reliably
✅ Homepage styles load correctly
✅ Navbar visible on all pages
✅ Mobile navigation works without race conditions
✅ URL and content stay synchronized

## Lessons Learned

1. **Avoid setTimeout for async coordination** - Use proper async/await patterns
2. **Watch configuration is critical** - Prevent build loops by ignoring generated files
3. **Test on initial page load** - FOUC issues only appear on direct navigation
4. **Router guards prevent race conditions** - Always wait for `router.isReady()` before state changes
5. **Timing hacks are technical debt** - They work until they don't

## Related Plans

- [Foundations Landing Page](./01-foundations-landing-page.md) - Original implementation
- [Navigation Flattening](./02-navigation-flattening.md) - Structural changes that exposed these bugs
- [Dialtone Overview Section](./03-dialtone-overview-section.md) - Built on top of these fixes
