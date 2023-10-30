# Dialtone 8 Migration guide

Migration from dialtone version `7` to `8`

Dialtone 8.x deprecates the use of LESS variables to favor the usage of [Design tokens](https://spectrum.adobe.com/page/design-tokens/).

While the migration should be straightforward using the provided script, there might be instances where manual updates
to a product's code are required.

These are usually search-and-replace tasks, and may include decisions to be made with your Product Designer 
like RAW HEX values or CSS variables that are not semantically correct. e.g:

- We might find this property `background-color: var(--dt-color-neutral-white)` in order to make sure
that this is going to have the expected behaviour, we need to change the fixed color variable to its corresponding
semantically correct token `background-color: var(--dt-color-surface-primary)` this ensures the background color 
to use the right `surface` color token.

---

## Changes

## Migration Script

Dialtone 8 provides a migration script helper that should do most of the search and replacement needed.

### Options

- `--cwd` Specify the root directory for scan, defaults to CWD.
- `---ignore` Comma separated 'glob patterns' of files or paths you want the script to ignore
- `--force` Skip interactive prompts, use with caution!.

### Usage

```bash
npx dialtone-migration-helper [options]
```

The script will prompt what do you want to migrate:

- Box shadows
- Colors
- Fonts
- Size and Space

Each migration configuration search and replace different CSS variables and classes, you'll have to run every migration
configuration manually to prevent unwanted changes.

Once you select a migration to run, If there are files that require a migration, the script will give you a list of
what files are going to be modified and prompt if you are ok with that.

⚠️ Caution: **Make sure that the files listed are correct before proceeding.**

## Migration Steps

Follow steps in this exact order.

### 1. Update to Dialtone 8

```bash
npm install @dialpad/dialtone@next
```

### 2. Run the script

⚠️ Running the script from the root of your project is dangerous, 
and it's not recommended to run it on all your code base at once, this might break things.

It is highly recommended to navigate to the desired folder and run it only on the desired files 
for the piece of UI you wish to change

- **Navigate to the desired project folder**

```bash
npx dialtone-migration-helper --include "file1" "file2"
```

### 3. Verify the migration script changed the files as expected

### 4. Replace CSS Variables, HEX Values, color names and CSS Classes with their Semantic Version

The migration script can automate most of the work, but still some manual replacements
need to be done due to limitations on the script ability to know the scope of the variables to be replaced.

As a rule of thumb, when applying color reach first for Design Tokens (either as CSS variables or CSS Utilities)
unless they meet a specific design need to use a base color.

* Foreground content (text and icons)
* Surfaces/Background
* Borders

For example, the default foreground color shall be `var(--dt-color-foreground-primary)`.
So any previous use of `var(--black-900)`, `#000`, `#000000`, `black`, etc...
Should use `var(--dt-color-foreground-primary)`.

#### Foreground Color (CSS `color` property)

* CSS Variables

|     Search for     |                 Replace with                 | Alternative                          |
|:------------------:|:--------------------------------------------:|:-------------------------------------|
| `var(--black-500)` |  `var(--dt-color-foreground-placeholder) `   | `var(--dt-color-foreground-disabled` |
| `var(--black-600)` |    `var(--dt-color-foreground-tertiary)`     |                                      |
| `var(--black-700)` |    `var(--dt-color-foreground-secondary)`    |                                      |
| `var(--black-900)` |     `var(--dt-color-foreground-primary)`     |                                      |
|  `var(--red-300)`  |    `var(--dt-color-foreground-critical)`     |                                      |
|  `var(--red-400)`  | `var(--dt-color-foreground-critical-strong)` |                                      |
| `var(--green-400)` |     `var(--dt-color-foreground-success)`     |                                      |
| `var(--green-500)` | `var(--dt-color-foreground-success-strong)`  |                                      |
| `var(--gold-500)`  |     `var(--dt-color-foreground-warning)`     |                                      |

* HEX Values

| Search for |                 Replace with                 |
|:----------:|:--------------------------------------------:|
|   `#000`   |    `var(--dt-color-foreground-primary) `     |
| `#000000`  |     `var(--dt-color-foreground-primary)`     |
| `#3A3A3A`  |    `var(--dt-color-foreground-secondary)`    |
|   `#555`   |    `var(--dt-color-foreground-tertiary)`     |
| `#555555`  |    `var(--dt-color-foreground-tertiary)`     |
| `#EC0E0E`  |    `var(--dt-color-foreground-critical)`     |
| `#B70B0B`  | `var(--dt-color-foreground-critical-strong)` |
| `#1AA340`  |     `var(--dt-color-foreground-success)`     |
| `#124620`  | `var(--dt-color-foreground-success-strong)`  |
| `#815008`  |     `var(--dt-color-foreground-warning)`     |

* Colors

| Search for |             Replace with              |
|:----------:|:-------------------------------------:|
|  `black`   | `var(--dt-color-foreground-primary) ` |
|   `gray`   | `var(--dt-color-foreground-tertiary)` |

* Classes

|    Search for    |      Replace with      |
|:----------------:|:----------------------:|
| `d-fc-black-700` |    `d-fc-secondary`    |
| `d-fc-black-600` |    `d-fc-tertiary`     |
|  `d-fc-red-300`  |    `d-fc-critical`     |
|  `d-fc-red-400`  | `d-fc-critical-strong` |
| `d-fc-green-400` |     `d-fc-success`     |
| `d-fc-green-500` | `d-fc-success-strong`  |
| `d-fc-gold-500`  |     `d-fc-warning`     |

#### Background Color (CSS `background-color` property)

* CSS Variables

|     Search for     |               Replace with                |
|:------------------:|:-----------------------------------------:|
|   `var(--white)`   |     `var(--dt-color-surface-primary)`     |
| `var(--black-100)` |    `var(--dt-color-surface-secondary)`    |
| `var(--black-200)` |    `var(--dt-color-surface-moderate)`     |
| `var(--black-300)` |      `var(--dt-color-surface-bold) `      |
| `var(--black-600)` |     `var(--dt-color-surface-strong) `     |
| `var(--black-800)` |    `var(--dt-color-surface-contrast) `    |
| `var(--black-900)` |    `var(--dt-color-surface-contrast) `    |
|  `var(--red-100)`  |    `var(--dt-color-surface-critical)`     |
|  `var(--red-400)`  | `var(--dt-color-surface-critical-strong)` |
| `var(--gold-100)`  |     `var(--dt-color-surface-warning)`     |
| `var(--gold-200)`  | `var(--dt-color-surface-warning-strong)`  |
| `var(--green-100)` |     `var(--dt-color-surface-success)`     |
| `var(--green-400)` | `var(--dt-color-surface-success-strong)`  |
| `var(--blue-100)`  |      `var(--dt-color-surface-info)`       |
| `var(--blue-400)`  |   `var(--dt-color-surface-info-strong)`   |

* HEX Values

| Search for |               Replace with                |
|:----------:|:-----------------------------------------:|
|   `#FFF`   |    `var(--dt-color-surface-primary) `     |
| `#FFFFFF`  |     `var(--dt-color-surface-primary)`     |
| `#F9F9F9`  |    `var(--dt-color-surface-secondary)`    |
| `#E9E9E9`  |    `var(--dt-color-surface-moderate)`     |
| `#D2D2D2`  |      `var(--dt-color-surface-bold)`       |
|   `#555`   |     `var(--dt-color-surface-strong)`      |
| `#555555`  |     `var(--dt-color-surface-strong)`      |
|   `#222`   |    `var(--dt-color-surface-contrast)`     |
| `#222222`  |    `var(--dt-color-surface-contrast)`     |
|   `#000`   |    `var(--dt-color-surface-contrast)`     |
| `#000000`  |    `var(--dt-color-surface-contrast)`     |
| `#FFE5E6`  |    `var(--dt-color-surface-critical)`     |
| `#B70B0B`  | `var(--dt-color-surface-critical-strong)` |
| `#FFF4CC`  |     `var(--dt-color-surface-warning)`     |
| `#FFDB80`  | `var(--dt-color-surface-warning-strong)`  |
| `#EDF9EB`  |     `var(--dt-color-surface-success)`     |
| `#1AA340`  | `var(--dt-color-surface-success-strong)`  |
| `#EAF2FA`  |      `var(--dt-color-surface-info)`       |
| `#1768C6`  |   `var(--dt-color-surface-info-strong)`   |

* Colors

| Search for |            Replace with            |
|:----------:|:----------------------------------:|
|  `white`   | `var(--dt-color-surface-primary) ` |
|  `black`   | `var(--dt-color-surface-contrast)` |

* Classes

|    Search for     |      Replace with       |
|:-----------------:|:-----------------------:|
|   `d-bgc-white`   |     `d-bgc-primary`     |
| `d-bgc-black-100` |    `d-bgc-secondary`    |
| `d-bgc-black-200` |    `d-bgc-moderate`     |
| `d-bgc-black-300` |      `d-bgc-bold`       |
| `d-bgc-black-600` |     `d-bgc-strong`      |
| `d-bgc-black-800` |    `d-bgc-contrast`     |
| `d-bgc-black-900` |    `d-bgc-contrast`     |
|   `d-bgc-black`   |    `d-bgc-contrast`     |
|  `d-bgc-red-100`  |    `d-bgc-critical`     |
|  `d-bgc-red-400`  | `d-bgc-critical-strong` |
| `d-bgc-gold-100`  |     `d-bgc-warning`     |
| `d-bgc-gold-200`  | `d-bgc-warning-strong`  |
| `d-bgc-green-100` |     `d-bgc-success`     |
| `d-bgc-green-400` | `d-bgc-success-strong`  |
| `d-bgc-blue-100`  |      `d-bgc-info`       |
| `d-bgc-blue-400`  |   `d-bgc-info-strong`   |

#### Border Color (CSS `border-color` property)

* CSS Variables

|      Search for      |               Replace with               |
|:--------------------:|:----------------------------------------:|
|   `var(--red-200)`   | `var(--dt-color-border-critical-subtle)` |
|   `var(--red-300)`   |    `var(--dt-color-border-critical)`     |
|   `var(--red-400)`   | `var(--dt-color-border-critical-strong)` |
|  `var(--green-200)`  | `var(--dt-color-border-success-subtle)`  |
|  `var(--green-400)`  |     `var(--dt-color-border-success)`     |
|  `var(--green-500)`  | `var(--dt-color-border-success-strong)`  |
|  `var(--gold-200)`   | `var(--dt-color-border-warning-subtle)`  |
|  `var(--gold-400)`   |     `var(--dt-color-border-warning)`     |
|  `var(--gold-500)`   | `var(--dt-color-border-warning-strong)`  |
| `var(--purple-200)`  |  `var(--dt-color-border-brand-subtle) `  |
| `var(--purple-400)`  |     `var(--dt-color-border-brand) `      |
| `var(--purple-500)`  |  `var(--dt-color-border-brand-strong) `  |
| `var(--magenta-300)` |     `var(--dt-color-border-accent) `     |

* HEX Values

| Search for |               Replace with               |
|:----------:|:----------------------------------------:|
| `#FF8585`  | `var(--dt-color-border-critical-subtle)` |
| `#EC0E0E`  |    `var(--dt-color-border-critical) `    |
| `#B70B0B`  | `var(--dt-color-border-critical-strong)` |
| `#B0FFA3`  | `var(--dt-color-border-success-subtle)`  |
| `#1AA340`  |     `var(--dt-color-border-success)`     |
| `#124620`  | `var(--dt-color-border-success-strong)`  |
| `#FFDB80`  | `var(--dt-color-border-warning-subtle)`  |
| `#D28F2B`  |     `var(--dt-color-border-warning)`     |
| `#815008`  | `var(--dt-color-border-warning-strong)`  |
| `#DAC7FF`  |  `var(--dt-color-border-brand-subtle)`   |
| `#7C52FF`  |      `var(--dt-color-border-brand)`      |
| `#3A1D95`  |  `var(--dt-color-border-brand-strong)`   |
| `#F9008E`  |     `var(--dt-color-border-accent)`      |

* Classes

|     Search for     |      Replace with      |
|:------------------:|:----------------------:|
|   `d-bc-red-200`   | `d-bc-critical-subtle` |
|   `d-bc-red-300`   |    `d-bc-critical`     |
|   `d-bc-red-400`   | `d-bc-critical-strong` |
|  `d-bc-green-200`  | `d-bc-success-subtle`  |
|  `d-bc-green-400`  |     `d-bc-success`     |
|  `d-bc-green-500`  | `d-bc-success-strong`  |
|  `d-bc-gold-200`   | `d-bc-warning-subtle`  |
|  `d-bc-gold-400`   |     `d-bc-warning`     |
|  `d-bc-gold-500`   | `d-bc-warning-strong`  |
| `d-bc-purple-200`  |  `d-bc-brand-subtle`   |
| `d-bc-purple-400`  |      `d-bc-brand`      |
| `d-bc-purple-500`  |  `d-bc-brand-strong`   |
| `d-bc-magenta-300` |     `d-bc-accent`      |

### 5. Visually verify the UI

Visually verify the piece of UI you changed in light mode as well as dark mode, 
fix anything that is obviously off.

### 6. Share a preview

Share a preview with your product designer to make sure that 
everything's working and looking as it should and make any further requested changes.

### 7. Make a PR to commit your changes.

### 4. Repeat steps [2. Run the script](#2-run-the-script) through [7. Make a PR](#7-make-a-pr-to-commit-your-changes) until all the migrations are done across the codebase.
