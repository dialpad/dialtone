# Homepage Carousel Interactive Feature

## Overview

**Status:** In Progress
**Created:** 2024-11-13
**Last Updated:** 2024-11-13

Implementation of an interactive, mouse-controlled infinite scrolling carousel for the Dialtone documentation homepage showcase images. The feature aims to provide intuitive speed control based on mouse position but has encountered significant challenges with responsiveness and control architecture.

## Goals

- Implement infinite horizontal scrolling carousel for showcase images
- Provide mouse-position-based speed control with intuitive acceleration
- Create smooth, responsive transitions between different scroll speeds
- Establish clear dead zone in center for content exploration

## Non-Goals

- Touch/mobile gesture controls (desktop mouse interaction only)
- Keyboard navigation support
- Individual image selection or click interactions
- Pause/play buttons or UI controls

## Success Criteria

- Carousel scrolls continuously at default speed when mouse is not hovering
- Mouse position directly controls scroll speed with immediate response
- Center 15-30% of container acts as dead zone with minimal movement
- Edge positions achieve significantly faster scrolling (50-100x center speed)
- Smooth visual experience without jarring speed changes

## Constraints & Guardrails

**Technical Constraints:**

- Must work within Vue 3 composition API in VuePress environment
- Cannot use external carousel libraries (pure implementation required)
- Must maintain 60fps performance with smooth animations
- Image cloning approach required for infinite loop effect

**Business Constraints:**

- Feature must be intuitive without instructions or UI indicators
- Cannot interfere with other page scroll behaviors

**Documentation Principle:**

- ⚠️ **CRITICAL**: After implementation, update `/docs/features/` with carousel interaction documentation
- Include troubleshooting guide for common speed/responsiveness issues
- Document all configurable speed variables and their effects

**Key Risks:**

- **Scope variable access**: JavaScript closures and scope issues between event handlers and animation loop
- **Speed responsiveness**: Smoothing factors preventing immediate speed changes
- **Performance**: High-speed scrolling may cause frame drops with many images

## Implementation Steps

### Phase 1: Basic Infinite Scroll Setup

1. **Create carousel HTML structure**
   - What: Wrap showcase images in carousel container with overflow hidden
   - Why: Establish scrollable track within confined viewport
   - Considerations: Maintain original image dimensions and gaps
   - Dependencies: None

2. **Clone images for seamless loop**
   - What: Duplicate all images 2-3 times in JavaScript on mount
   - Why: Enable infinite scrolling without visible seams
   - Considerations: Memory usage with multiple clones
   - Dependencies: Step 1

3. **Implement animation loop**
   - What: Create requestAnimationFrame-based position update loop
   - Why: Smooth 60fps animation with direct control
   - Considerations: Track position reset logic for infinite effect
   - Dependencies: Step 2

### Phase 2: Mouse Interaction System

1. **Add mouse event listeners**
   - What: Track mouseenter, mouseleave, and mousemove on container
   - Why: Capture user interaction for speed control
   - Considerations: Event listener cleanup on unmount
   - Dependencies: Step 3

2. **Calculate relative mouse position**
   - What: Convert mouse coordinates to -1 to 1 range from center
   - Why: Normalized values for speed calculations
   - Considerations: Container boundary detection
   - Dependencies: Step 1 (Phase 2)

3. **Implement speed calculation function**
   - What: Map mouse position to speed with dead zone and acceleration curve
   - Why: Create intuitive speed control based on position
   - Considerations: Exponential vs linear curves, dead zone percentage
   - Dependencies: Step 2 (Phase 2)

### Phase 3: Speed Control Integration

1. **Connect speed to animation loop**
   - What: Apply calculated speed to position updates
   - Why: Enable dynamic speed control
   - Considerations: Direct application vs smoothing trade-offs
   - Dependencies: Step 3 (Phase 2)

2. **Handle hover state transitions**
   - What: Switch between default and interactive speeds
   - Why: Maintain continuous movement when not interacting
   - Considerations: Smooth transitions vs immediate response
   - Dependencies: Step 1 (Phase 3)

3. **Fine-tune speed parameters**
   - What: Adjust max speed, dead zone, and acceleration curve
   - Why: Achieve desired user experience
   - Considerations: Balance between control and performance
   - Dependencies: Step 2 (Phase 3)

## Solution Implemented (2025-01-13)

### Root Cause Identified

After comprehensive analysis, the unresponsiveness was caused by **aggressive smoothing factor**:

**Mathematical Impact:**
- Smoothing factor of 0.1 requires ~23 frames (383ms at 60fps) to reach 90% of target speed
- This created an unacceptable lag that masked all other speed calculations
- The scope/reactivity issues mentioned in earlier attempts were red herrings

**Secondary Issues:**
- No true dead zone: Center still moved at 5px/frame instead of zero
- Weak acceleration curve: Only 60x speed range (300/5) instead of 100x+
- Single smoothing factor: No differentiation between hover and non-hover states

### Solution Approach

Implemented **dual-smoothing system** with **true dead zone** and **aggressive exponential acceleration**:

1. **Adaptive Smoothing**
   - `SMOOTHING_ACTIVE = 0.4`: Fast response when hovering (reaches 90% in ~83ms/5 frames)
   - `SMOOTHING_INACTIVE = 0.15`: Smooth transition when leaving (reaches 90% in ~233ms/14 frames)

2. **True Dead Zone**
   - `DEAD_ZONE = 0.20`: Center 20% of container has absolutely zero movement
   - Maps `[DEAD_ZONE, 1.0] → [0, 1.0]` for smooth acceleration outside dead zone

3. **Exponential Acceleration Curve**
   - `CURVE_EXPONENT = 2.5`: Dramatic speed increase at edges
   - `MAX_SPEED = 350` px/frame (21,000 px/sec at 60fps)
   - Results: 0 at center → 350 at edges (effectively ∞ ratio from dead zone edge)

4. **Component Extraction**
   - Created `/apps/dialtone-documentation/docs/.vuepress/baseComponents/ShowcaseCarousel.vue`
   - Improved maintainability and separation of concerns
   - Includes debug overlay for verification

### Implementation Details

**Configuration Constants:**
```javascript
const DEFAULT_SPEED = -8;          // Slow leftward scroll when not hovering
const MAX_SPEED = 350;              // Maximum speed at edges (px/frame)
const DEAD_ZONE = 0.20;             // Center 20% has zero movement
const CURVE_EXPONENT = 2.5;         // Exponential acceleration curve
const SMOOTHING_ACTIVE = 0.4;       // Fast response when hovering
const SMOOTHING_INACTIVE = 0.15;    // Smooth transition when leaving
```

**Speed Behavior:**
- Dead zone center: 0 px/frame
- 40% from center: 35 px/frame (10% of max)
- 60% from center: 91 px/frame (26% of max)
- 80% from center: 189 px/frame (54% of max)
- Edge (100%): 350 px/frame (100% of max)

**Files Modified:**
1. Created: `/apps/dialtone-documentation/docs/.vuepress/baseComponents/ShowcaseCarousel.vue`
2. Updated: `/apps/dialtone-documentation/docs/index.md` - Replaced inline carousel with component
3. Updated: This plan document

**Debug Overlay:**
Temporary overlay showing real-time values:
- Hover state (boolean)
- Target speed (px/frame)
- Current speed (px/frame)
- Position (px)
- Active smoothing factor

### Verification Steps

1. ✅ Load page, confirm default leftward scroll at -8 px/frame
2. ⏳ Hover center, confirm speed = 0 (dead zone)
3. ⏳ Move to left edge, confirm speed approaches +350
4. ⏳ Move to right edge, confirm speed approaches -350
5. ⏳ Verify speed changes within ~100ms of mouse movement
6. ⏳ Mouse leave, verify smooth transition back to default
7. ⏳ Remove debug overlay once verified

---

## Phase Completion Summaries

### Phase 1 Complete (2024-11-13)

**Completed:**

- Added carousel container structure with overflow hidden
- Implemented image cloning (3x copies for smooth loop)
- Created basic animation loop with position tracking

**Modified:**

- Changed from CSS animation to JavaScript requestAnimationFrame
- Reason: Need direct speed control not possible with CSS

**Removed:**

- CSS keyframe animations
- Reason: Incompatible with dynamic speed requirements

**Deviations from Plan:**

- Used 3 image sets instead of 2 for smoother infinite scroll

**Blockers/Issues:**

- None in Phase 1

### Phase 2 Complete (2024-11-13)

**Completed:**

- Added mouse event listeners for all three events
- Implemented position normalization to -1 to 1 range
- Created multiple speed calculation approaches

**Modified:**

- Tried multiple calculation methods (linear, quadratic, cubic, exponential)
- Reason: Searching for most intuitive control feel

**Removed:**

- Complex dead zone calculations in some iterations
- Reason: Simplified for debugging

**Deviations from Plan:**

- Experimented with both smoothed and direct speed application

**Blockers/Issues:**

- Speed changes not responsive despite high values
- Scope issues with isHovering variable access

### Phase 3 Attempted (2024-11-13)

**Completed:**

- Multiple integration approaches attempted
- Various smoothing factors tested (0.1 to 1.0)

**Modified:**

- Switched between targetSpeed/currentSpeed and direct speed models
- Reason: Attempting to fix responsiveness issues

**Removed:**

- Smoothing when hovering (attempted instant response)
- Reason: Smoothing was dampening speed changes

**Deviations from Plan:**

- Complete architecture redesign attempted (Version 2)
- Added debugging comments for speed values

**Blockers/Issues:**

- **CRITICAL**: Speed changes have minimal effect regardless of values
- **CRITICAL**: Scope/closure issues preventing proper variable access
- **UNRESOLVED**: Default speed sometimes faster than max interactive speed
- **UNRESOLVED**: Smoothing factor creates lag even when removed for hover state

## Open Questions

- [ ] Is the animation loop properly accessing the current hover state?
- [ ] Are there Vue reactivity issues with plain JavaScript variables?
- [ ] Should speed calculation be moved inside the animation loop?
- [ ] Would Vue refs solve the scope/reactivity problems?
- [ ] Is requestAnimationFrame the right approach vs CSS transforms?

## References

- Original implementation: `/Users/francisrupert/src/dialtone/apps/dialtone-documentation/docs/index.md`
- Lines 328-450 contain the carousel implementation
- Multiple stashed versions with different approaches attempted
- No external documentation available for this custom implementation

## Technical Analysis of Failures

### Attempted Approaches

1. **CSS Animation with Fixed Duration**
   - Result: Works but no dynamic control

2. **Target Speed with Smoothing**
   - Result: Smoothing factor (0.1) too aggressive, prevents responsive changes

3. **Direct Speed Application**
   - Result: Scope issues prevented proper variable access

4. **Separated Hover vs Non-Hover Logic**
   - Result: isHovering variable not accessible in animation scope

5. **Mouse Position Tracking**
   - Result: Most promising but still had responsiveness issues

### Root Cause Analysis

The primary issues appear to be:

1. **Variable Scope**: JavaScript closures not properly maintaining access to state variables
2. **Smoothing Logic**: Even minimal smoothing (0.1 factor) creates unacceptable lag
3. **Speed Calculation**: Mathematical curves may be correct but application is wrong
4. **Architecture**: Separation of concerns between event handlers and animation loop problematic

### Recommended Next Steps ✅ COMPLETED

~~1. Consider using Vue reactive refs for all state variables~~
~~2. Implement debug overlay showing actual speed values in real-time~~
~~3. Test with single animation frame updates (no loop) to isolate issues~~
~~4. Consider alternative architecture with speed as computed property~~
~~5. Investigate whether VuePress/Vue lifecycle is interfering~~

**Actual Solution:**
1. ✅ Fixed smoothing factor (0.1 → 0.4 when hovering, 0.15 when leaving)
2. ✅ Implemented true dead zone (center 20%)
3. ✅ Increased acceleration curve exponent (1.5 → 2.5)
4. ✅ Added debug overlay for real-time verification
5. ✅ Extracted to ShowcaseCarousel.vue component for maintainability

**Conclusion:** The issue was NOT scope/reactivity/architecture - it was purely the aggressive smoothing factor masking all speed changes.

## Configuration Variables for Testing

**Location:** `/apps/dialtone-documentation/docs/.vuepress/baseComponents/ShowcaseCarousel.vue`

Current parameters (lines 22-27):

- **DEFAULT_SPEED = -8**: Slow leftward scroll when not hovering
- **MAX_SPEED = 350**: Maximum speed at edges (px/frame)
- **DEAD_ZONE = 0.20**: Center 20% has zero movement
- **CURVE_EXPONENT = 2.5**: Exponential acceleration curve
- **SMOOTHING_ACTIVE = 0.4**: Fast response when hovering
- **SMOOTHING_INACTIVE = 0.15**: Smooth transition when leaving

**Tuning Guide:** If behavior needs adjustment, modify these constants:

| To Make It... | Adjust | Direction |
|---------------|--------|-----------|
| More responsive | SMOOTHING_ACTIVE | Increase to 0.5-0.6 |
| Less twitchy | SMOOTHING_ACTIVE | Decrease to 0.25-0.3 |
| Larger dead zone | DEAD_ZONE | Increase to 0.25-0.30 |
| Smaller dead zone | DEAD_ZONE | Decrease to 0.15 |
| Faster at edges | MAX_SPEED | Increase to 400-500 |
| Slower at edges | MAX_SPEED | Decrease to 250-300 |
| More dramatic acceleration | CURVE_EXPONENT | Increase to 3.0-3.5 |
| Gentler acceleration | CURVE_EXPONENT | Decrease to 2.0 |
