---
title: Halftone
description: The Resolve halftone is Dialpad's brand texture, a halftone swirl over an animated gradient map. It replaces the gradient as the brand's color and texture expression.
status: ready
thumb: true
figma_url: https://www.figma.com/design/pNwlnL86ybgXvyXepg8qfM/27Q2-Resolve-Brand---Web-Updates?node-id=8572-41124
keywords: ["halftone", "resolve", "texture", "brand texture", "dots", "pairings", "hero", "banner", "background"]
---

<img src="/assets/images/halftone--billboard.jpg" alt="Resolve halftone with Ultra Light Purple dots on Light Tan" class="d-bar-500 d-d-block d-w100p d-mbs-600" />

## What it is

The halftone always has two layers:

1. **A greyscale map**: a 4-pole mesh swirl, a radial field, a radial burst, or the luminance of a photo or video. The map is never shown.
2. **The Dialpad Resolve Halftone effect**: a fixed golden-angle dot lattice that sizes each dot from the map beneath it.

The dots never move. They grow and shrink as the map changes, so the field reads as a slow swirl rather than drifting particles. All color comes from an approved ground and dot pairing.

Always use the brand effect exactly as authored in Figma. Never substitute a stock halftone, a circle halftone, or a dot screen.

## Where to use it

<div class="d-d-grid d-g-600 d-g-cols1 md:d-g-cols3 d-ai-center">
  <div>
    <ul>
      <li class="d-docsite--list-element"><strong>Hero and banner media:</strong> an animated field in a rounded frame.</li>
      <li class="d-docsite--list-element"><strong>Backdrop for product UI:</strong> a halftone tile behind floating UI, status pills, and screenshots.</li>
      <li class="d-docsite--list-element"><strong>Candid customer imagery:</strong> the halftone carries real customer photos and video.</li>
      <li class="d-docsite--list-element"><strong>AI-active moments:</strong> the animated halftone replaces the motion gradient.</li>
    </ul>
  </div>
  <div class="d-gc2">
    <img src="/assets/images/halftone--neutral.jpg" alt="Neutral Resolve halftone with Dark Tan dots on Light Tan" class="d-bar-500 d-d-block d-w100p" />
  </div>
</div>

## Rules

- **Never set text on the dots.** Headlines and body copy sit on the plain Light Tan page beside the frame, or in a white container on top of it.
- **Contain it in a rounded frame:** 20px for hero frames, banners, and panels, and 16px for card tiles. It's never a page or section background.
- **Animate it when possible**, using a 10-second loop. Small tiles repeated in a grid can be static. Pause it off-screen, and show a still frame under `prefers-reduced-motion`.
- **Use one ground and one dot color per field**, from the approved pairings. Never use gradient-filled dots or mix two pairings in one field.
- **Keep it fine and subtle.** Dots stay small relative to the frame. Don't enlarge them into a polka-dot pattern.
- **Render it from code.** Never approximate it with hand-placed dots, a CSS pattern, or an image generator. When a static file is required, export it from the code render.

## Approved pairings

**Primary** pairings carry top-level communications: homepage, platform, launch heroes, campaign covers, and title slides. **Secondary** and **tertiary** pairings add variety across sets of cards, banners, and campaign creative.

| Tier | Ground | Dots |
| --- | --- | --- |
| Primary | Light Tan `#F8F7F6` | Dark Tan `#CEC8C4`, Ultra Light Purple `#D3BCFF`, Light Purple `#A38FF9`, or White `#FFFFFF` |
| Primary | Tan `#F2F0EE` | White `#FFFFFF` |
| Primary | Dark Tan `#CEC8C4` | White `#FFFFFF` |
| Primary | Ultra Light Purple `#D3BCFF` | Purple `#7C52FF` |
| Primary | Purple `#7C52FF` | Ultra Light Purple `#D3BCFF` |
| Primary (contained only) | Deep Blue `#10022C` | Purple `#7C52FF` |
| Secondary | Ultra Light Purple `#D3BCFF` | Halftone Coral `#FF716F` |
| Secondary | Coral `#FFABA4` | Purple `#7C52FF` |
| Secondary | Pink `#FFB1CF` | Purple `#7C52FF` |
| Tertiary | Coral `#FFABA4` | Magenta `#FF1BA4` |
| Tertiary | Pink `#FFB1CF` | Bright Red `#FF1356` or Magenta `#FF1BA4` |
| Tertiary | Yellow `#FFE89C` | Gold `#FF9E0E` |

Hero frames can also run the animated **Resolve dot cycle**, which moves the dots through Ultra Light Purple, Pink, and Coral over 10 seconds.

<div class="d-d-grid d-g-400 d-g-cols1 md:d-g-cols2">
  <figure>
    <img src="/assets/images/halftone--purple.jpg" alt="Primary pairing: Ultra Light Purple dots on Purple" class="d-bar-500 d-d-block d-w100p" />
  </figure>
  <figure>
    <img src="/assets/images/halftone--secondary-ulp-coral.jpg" alt="Secondary pairing: coral dots on Ultra Light Purple" class="d-bar-500 d-d-block d-w100p" />
  </figure>
  <figure>
    <img src="/assets/images/halftone--secondary-coral-purple.jpg" alt="Secondary pairing: Purple dots on coral" class="d-bar-500 d-d-block d-w100p" />
  </figure>
  <figure>
    <img src="/assets/images/halftone--tertiary-coral-magenta.jpg" alt="Tertiary pairing: Magenta dots on coral" class="d-bar-500 d-d-block d-w100p" />
  </figure>
</div>

- Favor light grounds. Deep Blue is the only dark ground, and it appears only inside a contained frame or banner.
- Campaign colors (Magenta, Bright Red, Gold) can appear as halftone dots in these pairings. That's their only evergreen use.
- In a row of cards, color about half the tiles at most and keep the rest neutral. Give each colored tile a different pairing.

## UI on halftone

<div class="d-d-grid d-g-600 d-g-cols1 md:d-g-cols3 d-ai-center">
  <div class="d-gc2">
    <p class="d-docsite--paragraph">The halftone's main job is to stage product UI. Put a halftone media tile (16px radius) at the top of a white card. Place the eyebrow, title, body, and button below the tile, never on it.</p>
    <p class="d-docsite--paragraph">Floating UI on the tile forms a <strong>centered stack</strong>:</p>
    <ul>
      <li class="d-docsite--list-element">The context UI panel goes on top.</li>
      <li class="d-docsite--list-element">The status pill sits about 12px below it.</li>
      <li class="d-docsite--list-element">Center the stack horizontally and vertically in the tile.</li>
    </ul>
    <p class="d-docsite--paragraph">Status pills are white, with an 8px radius and a lime <code>#D1FF76</code> icon chip. Their labels state an outcome, like "Lab test scheduled." Both the panel and the pill get the <code>brand-ui</code> drop shadow.</p>
  </div>
  <figure>
    <img src="/assets/images/resolve--feature-card.png" alt="Feature card with a product UI panel and a Lab test scheduled status pill stacked and centered above the card copy" class="d-bar-500 d-d-block d-w100p" />
  </figure>
</div>

## Candid customer imagery

The halftone can carry real customer photography and video, so people appear in hero and campaign moments without a stock-photo look.

- Use candid footage of real people at work. Never use posed stock or AI-generated people.
- The photo's luminance drives the dots, so only the halftone is shown. Use primary pairings on Light Tan.
- Prefer video. The dots start coarse and resolve into detail as the footage plays.
- Let the edges dissolve into the Light Tan page, and keep copy off the dots.
- Photos inside product UI mockups, like avatars and video tiles, stay untreated.
