# Convert Embedded SVG to SVG Loader Component

## Overview

**Type:** Process Documentation
**Status:** Active
**Created:** 2025-01-13
**Last Updated:** 2025-01-13

Document a repeatable process for converting embedded `<svg>...</svg>` elements in markdown files to external SVG files loaded via `<svg-loader name="..." />` components. This improves maintainability, reduces file sizes, and enables reuse of SVG assets.

## When to Use This Process

Use this process when:

- Documentation markdown files contain large embedded `<svg>` elements
- Multiple SVGs follow a consistent naming/numbering pattern
- Page load performance needs improvement due to large markdown files
- You want to standardize image asset management across documentation
- SVG assets should be reusable across multiple pages

## Prerequisites

- Access to the markdown file(s) containing embedded SVGs
- Understanding of where svg-loader components are used in the codebase
- Ability to identify/create a consistent naming convention pattern
- Location of the SVG assets directory: `/apps/dialtone-documentation/docs/.vuepress/public/assets/images/`

## Process Steps

### Step 1: Identify Files with Embedded SVGs

**What:** Locate markdown files that contain embedded `<svg>` elements alongside svg-loader components waiting to be used.

**How:**

```bash
# Find markdown files with svg-loader components
grep -r "<svg-loader" /path/to/docs/ --include="*.md"

# Check file size to identify likely candidates
ls -lh /path/to/suspected/file.md
```

**Expected Output:** Files with unusually large sizes (multi-megabyte markdown files typically indicate embedded SVGs)

**Example:**

```bash
# Found: /docs/foundations/colors/marketing/index.md (14MB)
```

### Step 2: Analyze the SVG Embedding Pattern

**What:** Examine the structure to understand the pattern of svg-loader components and their corresponding embedded SVGs.

**How:**

```bash
# Find all svg-loader components in the file
grep -n "<svg-loader" /path/to/file.md

# Read a section to see the pattern
head -100 /path/to/file.md
```

**Expected Pattern:**

```html
<svg-loader class="d-bar16" name="topic--detail-01" />
<svg>
  <!-- Large embedded SVG content -->
</svg>
```

The svg-loader component name attribute indicates what the external SVG file should be named.

### Step 3: Determine Naming Convention

**⚠️ USER INPUT REQUIRED**

**What:** Identify the naming pattern for the SVG files to be extracted.

**How to Determine:**

1. Look at the `name` attributes in existing svg-loader components
2. Check if similar SVGs already exist in the target directory
3. Identify the pattern structure

**Common Patterns:**

- `[topic]--[detail-name].svg` (e.g., `logo--alignment.svg`, `logo--clear-space.svg`)
- `[topic]--[number].svg` (e.g., `color-marketing--01.svg`, `color-marketing--02.svg`)
- `[category]-[subcategory]--[variant].svg`

**Document Your Pattern:**

```
Pattern: color-marketing--[01-06].svg
- Prefix: color-marketing
- Separator: --
- Suffix: Two-digit number (01, 02, 03, etc.)
- Total files: 6
```

### Step 4: Extract SVGs to Separate Files

**What:** Extract each embedded `<svg>...</svg>` element and save it as a standalone SVG file using the naming pattern from Step 3.

**Target Location:**

```
/apps/dialtone-documentation/docs/.vuepress/public/assets/images/
```

**Naming:** Use the exact name from the svg-loader's `name` attribute + `.svg` extension

**Automation Approach:**

For large files (>1MB), use the Task tool with general-purpose agent:

```
Task: Extract embedded SVGs from [file path]
- Find all svg-loader components with name attributes
- Extract the corresponding <svg>...</svg> content following each
- Save to /assets/images/{name}.svg
- Remove embedded SVG from markdown, keeping only svg-loader
```

**Manual Approach (for small files):**

1. Copy the `<svg>` opening tag through `</svg>` closing tag
2. Save as `/assets/images/{name-from-svg-loader}.svg`
3. Verify the SVG is valid (starts with `<svg`, ends with `</svg>`)
4. Repeat for each embedded SVG

### Step 5: Replace Embedded SVGs in Markdown

**What:** Remove all embedded `<svg>...</svg>` elements from the markdown file, leaving only the svg-loader components.

**Before:**

```html
<svg-loader class="d-bar16" name="color-marketing--01" />
<svg width="1200" height="800" viewBox="0 0 1200 800">
  <!-- 250KB of SVG content -->
</svg>
```

**After:**

```html
<svg-loader class="d-bar16" name="color-marketing--01" />
```

**How:**

- Use the general-purpose agent to rewrite the markdown file
- Keep all text content, headings, and svg-loader components
- Remove only the embedded `<svg>` elements

### Step 6: Verify the Conversion

**What:** Confirm that all SVGs load correctly via svg-loader components.

**Checklist:**

- [ ] All SVG files exist in `/assets/images/` directory
- [ ] Each SVG file is valid (has proper opening/closing tags)
- [ ] Markdown file size reduced significantly
- [ ] No embedded `<svg>` elements remain in markdown
- [ ] All svg-loader components present and unchanged
- [ ] Page renders correctly with external SVGs

**Verification Commands:**

```bash
# Check all SVG files were created
ls -lh /path/to/assets/images/[pattern]*.svg

# Verify no embedded SVGs remain
grep -c "<svg" /path/to/markdown.md  # Should only match svg-loader tags

# Check file size reduction
ls -lh /path/to/markdown.md
```

**Visual Verification:**

- Load the documentation page in browser
- Confirm all images render correctly
- Check browser console for any loading errors

## Real Example: Color Marketing Page

### Context

- **File:** `/docs/foundations/colors/marketing/index.md`
- **Original size:** 14.01 MB (14,688,582 bytes)
- **Embedded SVGs:** 6 images
- **Pattern identified:** `color-marketing--[01-06].svg`

### Extraction Results

**Created Files:**

- `color-marketing--01.svg` (247K)
- `color-marketing--02.svg` (636K)
- `color-marketing--03.svg` (640K)
- `color-marketing--04.svg` (1.2M)
- `color-marketing--05.svg` (11M)
- `color-marketing--06.svg` (192K)

**After Conversion:**

- **File size:** 2.2 KB (2,240 bytes)
- **Reduction:** 99.98% smaller
- **Lines:** 56 (down from thousands)

### Before (snippet):

```html
<svg-loader class="d-bar16" name="color-marketing--01" />
<svg width="1920" height="1080" viewBox="0 0 1920 1080" fill="none">
  <rect width="1920" height="1080" fill="#F8F7F6"/>
  <!-- ... 250KB of SVG content ... -->
</svg>
```

### After:

```html
<svg-loader class="d-bar16" name="color-marketing--01" />
```

The svg-loader component now loads the external file `/assets/images/color-marketing--01.svg`.

## Success Criteria

When the conversion is complete, you should have:

- [ ] All embedded `<svg>` elements removed from markdown files
- [ ] External SVG files created with consistent naming following the identified pattern
- [ ] Markdown file size reduced by >90% (typically 95%+ reduction)
- [ ] All svg-loader components render correctly in the browser
- [ ] No broken images or console errors in documentation
- [ ] Naming convention pattern documented for future reference
- [ ] Backup of original markdown file created (automatically by agent)

## Common Issues & Solutions

### Issue 1: File Size Still Large After Conversion

**Problem:** Markdown file is still multi-megabyte after supposed conversion.

**Solution:**

- Check if all `<svg>` elements were actually removed
- Use `grep "<svg" file.md` to find any remaining embedded SVGs
- Some may have been missed if they have unusual formatting

### Issue 2: SVG Not Loading in Browser

**Problem:** svg-loader component shows blank or broken image.

**Solution:**

- Verify the SVG file exists at the exact path: `/assets/images/{name}.svg`
- Check that the `name` attribute matches the filename (without .svg extension)
- Inspect the SVG file - ensure it has valid opening `<svg>` and closing `</svg>` tags
- Clear browser cache and dev server cache

### Issue 3: Invalid SVG File

**Problem:** SVG file was created but contains errors or incomplete content.

**Solution:**

- Open the SVG file and verify it starts with `<svg` and ends with `</svg>`
- Check that nested elements are properly closed
- Validate SVG using an online SVG validator
- Re-extract from the backup file if needed

### Issue 4: Pattern Inconsistency

**Problem:** Some SVG files don't follow the naming pattern.

**Solution:**

- Review Step 3 and ensure pattern was correctly identified
- Check for edge cases (e.g., some files numbered differently)
- Update svg-loader `name` attributes if needed to match actual file names
- Document any exceptions to the pattern

## References

- **SvgLoader Component:** `/apps/dialtone-documentation/docs/.vuepress/baseComponents/SvgLoader.vue`
- **SVG Assets Directory:** `/apps/dialtone-documentation/docs/.vuepress/public/assets/images/`
- **Related Issue:** [Bug Fixes and Stability Improvements](../archive/04-bug-fixes-stability.md) - Phase 16 regex fix for overview cards
- **Image Organization Plan:** [Image Organization and Multi-Format Fallback](../future/image-organization-and-fallback.md) - Future work on image management

## Notes for Future Use

- This process works best with files >1MB containing multiple embedded SVGs
- For single SVG conversions, manual extraction may be faster
- Always run this on a git branch so changes can be easily reverted if needed
- The general-purpose agent handles large files better than manual editing
- File size reduction improves git performance and page load times
