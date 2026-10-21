---
title: Type in Marketing
description: How to set Season VF in marketing and brand communications, covering the type ramp, weights, stats, pull quotes, and text color.
figma_url: https://www.figma.com/design/pNwlnL86ybgXvyXepg8qfM/27Q2-Resolve-Brand---Web-Updates?node-id=8572-12589
status: ready
thumb: true
keywords: ["season vf", "season sans", "season mix", "brand font", "marketing typeface", "type ramp", "pull quote", "stat", "eyebrow", "dm sans"]
---

## Sans for everything except quotes

In brand and marketing communications, use **Season VF Sans** for headlines, display statements, stat numerals, eyebrows, body copy, buttons, labels, and UI shown in marketing assets. **Season VF Mix** is for one thing only: pull quotes and customer quotes. Product UI uses system fonts; see [Type in Product](/foundations/typography/).

- Never set a headline, hero title, or display statement in Mix.
- Never set stat numerals in Mix.
- Never fill text with a gradient. Headlines, eyebrows, body, and stats are always a solid brand color.

## Type ramp

Every font size comes from this ramp: **8, 10, 12, 16, 20, 24, 32, 48, 64, 96 px**. Don't use sizes in between. Sizes are listed mobile → desktop.

| Role | Size (px) | Weight | Line height | Letter spacing |
| --- | --- | --- | --- | --- |
| Display | 64 → 96 | 600 | 1.0 | −0.01em |
| Hero headline | 32 → 48 | 600 | 1.0 | −0.01em |
| Section headline | 24 → 32 | 600 | 1.2 | −0.005em |
| Card title | 20 / 24 | 600 | 1.2 | 0 |
| Lead body | 16 → 20 | 500 | 1.5 | 0 |
| Body | 16 | 500 | 1.5 | 0 |
| Eyebrow / subhead | 12 (hero, card) / 16 (section) | 700 | 1.2 | 0.05em, uppercase |
| Stat numeral | 32 → 48 → 64 | 600 | 1.0 | −0.01em |
| Pull quote (Mix) | 24 → 32 → 48 | 450 | 1.35 → 1.2 → 1.0 | −0.01em |
| Button | 16 / 12 | 600 | — | 0 |
| UI mockup micro text | 8 / 10 / 12 | — | — | — |

## Weights

| Weight | Use |
| --- | --- |
| 500 Medium | Body copy, navigation, card body |
| 600 SemiBold | Headlines at every size, stat numerals, button labels |
| 700 Bold | Eyebrows and subheads: always uppercase with 0.05em letter spacing |
| 450 (Mix) | Pull quotes only. Dialtone's bundled static `Season Mix` faces are 400, 600, and 700, so use 400 when you use those fonts. |

## Hierarchy in practice

<div class="d-d-grid d-g-600 d-g-cols1 md:d-g-cols3 d-ai-center">
  <div class="d-gc2">
    <p class="d-docsite--paragraph">A feature card shows the standard stack:</p>
    <ul>
      <li class="d-docsite--list-element">An eyebrow at 12px, weight 700, uppercase, in Purple.</li>
      <li class="d-docsite--list-element">A title at 24px, weight 600, in Deep Blue.</li>
      <li class="d-docsite--list-element">Body at 16px, weight 500.</li>
      <li class="d-docsite--list-element">A secondary button with a 600-weight label.</li>
    </ul>
  </div>
  <figure>
    <img src="/assets/images/resolve--feature-card.png" alt="Feature card with a purple RESOLVE eyebrow, a Deep Blue title, body copy, and a Learn more button below a product UI panel" class="d-bar-500 d-d-block d-w100p" />
  </figure>
</div>

## Stat numerals

Set stats in Season VF Sans at weight 600, in solid **Purple `#7C52FF`**, at 32 → 48 → 64px. Don't use gradient-filled numerals or Mix.

## Pull quotes

Pull quotes and customer quotes are the only place Season VF Mix appears. Set them at weight 450 in the Season VF variable font, or 400 with Dialtone's bundled `Season Mix` faces, at 24 → 32 → 48px. Use curly quotes and a hanging open-quote (`text-indent: -0.45em`). On a light page, a customer quote can sit in a contained Deep Blue card, set in Light Tan.

## Text color

- Headlines and body copy are **Deep Blue `#10022C`**.
- **Purple `#7C52FF`** is for eyebrows, subheads, and stat numerals only. Never set headlines, body copy, or long-form text in purple. Purple meets 4.5:1 only on White, so set small eyebrows on Light Tan or Tan in Deep Blue.
- Large secondary text can use **Ultra Dark Tan `#81807F`**. It's below 4.5:1 for small text, so keep small secondary text in Deep Blue.
- **Light Tan `#F8F7F6`** text appears only inside a contained Deep Blue element, such as a quote card.

See [Color in Marketing](/foundations/colors/marketing/#text-contrast) for contrast ratios, surfaces, and containers.

## Presentations and Google Workspace

Season VF can't be installed in Google Slides, Google Docs, PowerPoint, or Keynote, so use **DM Sans** throughout:

- Headlines and slide titles: SemiBold 600.
- Body and captions: Regular 400.
- Eyebrows and subheads: Bold 700, uppercase, 0.05em letter spacing.
- Button labels: SemiBold 600.
- Quotes: DM Sans Regular with curly quotes.
