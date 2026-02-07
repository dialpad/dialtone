# Design Tokens

Multi-platform values that make up Dialtone's design language

- **Keywords**: variables, css variables, design variables

Design Tokens are all the defined values that are part of the design system, such as color, spacing, typography, and more. Design tokens are published in many different forms so they can be consumed on all platforms (CSS, LESS, Android, iOS, etc).

See the [Dialtone Tokens README](https://github.com/dialpad/dialtone/tree/staging/packages/dialtone-tokens#readme) for usage info.

## Size

### Border

| Token | Value |
| --- | --- |
| `var(--dt-size-border-focus)` | 0.3rem |

## Color

### Foreground

| Token | Value |
| --- | --- |
| `var(--dt-color-foreground-primary)` | #1C1C1C |
| `var(--dt-color-foreground-secondary)` | #3A3A3A |
| `var(--dt-color-foreground-tertiary)` | #535353 |
| `var(--dt-color-foreground-muted)` | hsl(none 0% 0% / 0.5) |
| `var(--dt-color-foreground-placeholder)` | #808080 |
| `var(--dt-color-foreground-disabled)` | #808080 |
| `var(--dt-color-foreground-critical)` | #D90A45 |
| `var(--dt-color-foreground-critical-strong)` | #AF0032 |
| `var(--dt-color-foreground-success)` | #008E52 |
| `var(--dt-color-foreground-success-strong)` | #004F2E |
| `var(--dt-color-foreground-warning)` | #815008 |
| `var(--dt-color-foreground-primary-inverted)` | #F9F9F9 |
| `var(--dt-color-foreground-secondary-inverted)` | #E9E9E9 |
| `var(--dt-color-foreground-tertiary-inverted)` | #D2D2D2 |
| `var(--dt-color-foreground-muted-inverted)` | hsl(none 0% 97.647% / 0.65) |
| `var(--dt-color-foreground-placeholder-inverted)` | #AAAAAA |
| `var(--dt-color-foreground-disabled-inverted)` | #AAAAAA |
| `var(--dt-color-foreground-critical-inverted)` | #FF716F |
| `var(--dt-color-foreground-critical-strong-inverted)` | #FFABA4 |
| `var(--dt-color-foreground-success-inverted)` | #AEFB3C |
| `var(--dt-color-foreground-success-strong-inverted)` | #DBFFA9 |
| `var(--dt-color-foreground-warning-inverted)` | #FF9E0E |

### Link

| Token | Value |
| --- | --- |
| `var(--dt-color-link-primary)` | #7C52FF |
| `var(--dt-color-link-primary-hover)` | #5023DD |
| `var(--dt-color-link-critical)` | #D90A45 |
| `var(--dt-color-link-critical-hover)` | #AF0032 |
| `var(--dt-color-link-success)` | #008E52 |
| `var(--dt-color-link-success-hover)` | #004F2E |
| `var(--dt-color-link-warning)` | #815008 |
| `var(--dt-color-link-warning-hover)` | #533204 |
| `var(--dt-color-link-muted)` | #3A3A3A |
| `var(--dt-color-link-muted-hover)` | #1C1C1C |
| `var(--dt-color-link-disabled)` | #808080 |
| `var(--dt-color-link-disabled-hover)` | #808080 |
| `var(--dt-color-link-primary-inverted)` | #BBA6FC |
| `var(--dt-color-link-primary-inverted-hover)` | #D3BCFF |
| `var(--dt-color-link-critical-inverted)` | #FF716F |
| `var(--dt-color-link-critical-inverted-hover)` | #FFABA4 |
| `var(--dt-color-link-success-inverted)` | #AEFB3C |
| `var(--dt-color-link-success-inverted-hover)` | #DBFFA9 |
| `var(--dt-color-link-warning-inverted)` | #FF9E0E |
| `var(--dt-color-link-warning-inverted-hover)` | #FFDB80 |
| `var(--dt-color-link-muted-inverted)` | #E9E9E9 |
| `var(--dt-color-link-muted-inverted-hover)` | #F9F9F9 |
| `var(--dt-color-link-disabled-inverted)` | #AAAAAA |
| `var(--dt-color-link-disabled-inverted-hover)` | #AAAAAA |

### Surface

| Token | Value |
| --- | --- |
| `var(--dt-color-surface-primary)` | #FFFFFF |
| `var(--dt-color-surface-secondary)` | #F9F9F9 |
| `var(--dt-color-surface-moderate)` | #E9E9E9 |
| `var(--dt-color-surface-bold)` | #D2D2D2 |
| `var(--dt-color-surface-strong)` | #535353 |
| `var(--dt-color-surface-contrast)` | #252525 |
| `var(--dt-color-surface-critical)` | #FFE5E6 |
| `var(--dt-color-surface-warning)` | #FFF4CC |
| `var(--dt-color-surface-success)` | #EDF9EB |
| `var(--dt-color-surface-info)` | #EAF2FA |
| `var(--dt-color-surface-brand)` | #F5F0FF |
| `var(--dt-color-surface-critical-subtle)` | #FFF2F3 |
| `var(--dt-color-surface-warning-subtle)` | #FFFAE5 |
| `var(--dt-color-surface-success-subtle)` | #F6FCF5 |
| `var(--dt-color-surface-info-subtle)` | #F5F9FD |
| `var(--dt-color-surface-brand-subtle)` | #F9F6FF |
| `var(--dt-color-surface-critical-strong)` | #D90A45 |
| `var(--dt-color-surface-warning-strong)` | #FFBD48 |
| `var(--dt-color-surface-success-strong)` | #008E52 |
| `var(--dt-color-surface-info-strong)` | #1768C6 |
| `var(--dt-color-surface-brand-strong)` | #7C52FF |
| `var(--dt-color-surface-primary-opaque)` | hsl(none 0% 100% / 0.96) |
| `var(--dt-color-surface-secondary-opaque)` | hsl(none 0% 10.98% / 0.02) |
| `var(--dt-color-surface-moderate-opaque)` | hsl(none 0% 10.98% / 0.1) |
| `var(--dt-color-surface-bold-opaque)` | hsl(none 0% 10.98% / 0.19) |
| `var(--dt-color-surface-strong-opaque)` | hsl(none 0% 10.98% / 0.76) |
| `var(--dt-color-surface-contrast-opaque)` | hsl(none 0% 10.98% / 0.94) |
| `var(--dt-color-surface-critical-opaque)` | hsl(4.6154 100% 82.157% / 0.31) |
| `var(--dt-color-surface-warning-opaque)` | hsl(46.061 100% 80.588% / 0.5) |
| `var(--dt-color-surface-success-opaque)` | hsl(85.116 100% 83.137% / 0.25) |
| `var(--dt-color-surface-info-opaque)` | hsl(200.91 100% 87.059% / 0.35) |
| `var(--dt-color-surface-brand-opaque)` | hsl(260.6 100% 86.863% / 0.27) |
| `var(--dt-color-surface-critical-subtle-opaque)` | hsl(357.69 100% 94.902% / 0.5) |
| `var(--dt-color-surface-warning-subtle-opaque)` | hsl(47.059 100% 90% / 0.5) |
| `var(--dt-color-surface-success-subtle-opaque)` | hsl(111.43 53.846% 94.902% / 0.5) |
| `var(--dt-color-surface-info-subtle-opaque)` | hsl(210 61.538% 94.902% / 0.5) |
| `var(--dt-color-surface-brand-subtle-opaque)` | hsl(260.6 100% 86.863% / 0.2) |
| `var(--dt-color-surface-primary-inverted)` | #000000 |
| `var(--dt-color-surface-secondary-inverted)` | #252525 |
| `var(--dt-color-surface-moderate-inverted)` | #3A3A3A |
| `var(--dt-color-surface-bold-inverted)` | #535353 |
| `var(--dt-color-surface-strong-inverted)` | #AAAAAA |
| `var(--dt-color-surface-contrast-inverted)` | #F9F9F9 |
| `var(--dt-color-surface-critical-inverted)` | #380010 |
| `var(--dt-color-surface-warning-inverted)` | #2C1B02 |
| `var(--dt-color-surface-success-inverted)` | #012717 |
| `var(--dt-color-surface-info-inverted)` | #001429 |
| `var(--dt-color-surface-brand-inverted)` | #1D0155 |
| `var(--dt-color-surface-critical-subtle-inverted)` | #1C0108 |
| `var(--dt-color-surface-warning-subtle-inverted)` | #201301 |
| `var(--dt-color-surface-success-subtle-inverted)` | #00150D |
| `var(--dt-color-surface-info-subtle-inverted)` | #010B16 |
| `var(--dt-color-surface-brand-subtle-inverted)` | #10022C |
| `var(--dt-color-surface-critical-strong-inverted)` | #FF716F |
| `var(--dt-color-surface-warning-strong-inverted)` | #FFDB80 |
| `var(--dt-color-surface-success-strong-inverted)` | #AEFB3C |
| `var(--dt-color-surface-info-strong-inverted)` | #4AA9EA |
| `var(--dt-color-surface-brand-strong-inverted)` | #BBA6FC |
| `var(--dt-color-surface-primary-opaque-inverted)` | hsl(none 0% 0% / 0.85) |
| `var(--dt-color-surface-secondary-opaque-inverted)` | hsl(none 0% 100% / 0.15) |
| `var(--dt-color-surface-moderate-opaque-inverted)` | hsl(none 0% 100% / 0.23) |
| `var(--dt-color-surface-bold-opaque-inverted)` | hsl(none 0% 100% / 0.32) |
| `var(--dt-color-surface-strong-opaque-inverted)` | hsl(none 0% 100% / 0.67) |
| `var(--dt-color-surface-contrast-opaque-inverted)` | hsl(none 0% 100% / 0.97) |
| `var(--dt-color-surface-critical-opaque-inverted)` | hsl(342.39 85.185% 21.176% / 0.5) |
| `var(--dt-color-surface-warning-opaque-inverted)` | hsl(34.937 90.805% 17.059% / 0.35) |
| `var(--dt-color-surface-success-opaque-inverted)` | hsl(154.94 100% 15.49% / 0.3) |
| `var(--dt-color-surface-info-opaque-inverted)` | hsl(210.73 100% 8.0392% / 0.6) |
| `var(--dt-color-surface-brand-opaque-inverted)` | hsl(260 97.674% 16.863% / 0.8) |
| `var(--dt-color-surface-critical-subtle-opaque-inverted)` | hsl(344.44 93.103% 5.6863% / 0.6) |
| `var(--dt-color-surface-warning-subtle-opaque-inverted)` | hsl(34.839 93.939% 6.4706% / 0.3) |
| `var(--dt-color-surface-success-subtle-opaque-inverted)` | hsl(157.14 100% 4.1176% / 0.66) |
| `var(--dt-color-surface-info-subtle-opaque-inverted)` | hsl(211.43 91.304% 4.5098% / 0.66) |
| `var(--dt-color-surface-brand-subtle-opaque-inverted)` | hsl(260 91.304% 9.0196% / 0.66) |
| `var(--dt-color-surface-backdrop)` | hsl(none 0% 0% / 0.65) |
| `var(--dt-color-surface-ai)` | linear-gradient(135deg, #471571 0%, #551B84 3.08%, #7C229E 14.48%, #9024A4 23.67%, #B02290 35.5%, #D32B86 48.3%, #E92F6F 60.29%, #F6484F 70.08%, #FB7328 90.02%, #F3960F 97.29%, #F3960F 100%) |

### Border

| Token | Value |
| --- | --- |
| `var(--dt-color-border-subtle)` | hsl(none 0% 10.98% / 0.11) |
| `var(--dt-color-border-default)` | hsl(none 0% 10.98% / 0.17) |
| `var(--dt-color-border-moderate)` | hsl(none 0% 10.98% / 0.3) |
| `var(--dt-color-border-bold)` | hsl(none 0% 10.98% / 0.5) |
| `var(--dt-color-border-critical)` | #D90A45 |
| `var(--dt-color-border-success)` | #2EA834 |
| `var(--dt-color-border-warning)` | #FF9E0E |
| `var(--dt-color-border-brand)` | #7C52FF |
| `var(--dt-color-border-critical-subtle)` | #FF716F |
| `var(--dt-color-border-success-subtle)` | #D1FF76 |
| `var(--dt-color-border-warning-subtle)` | #FFDB80 |
| `var(--dt-color-border-brand-subtle)` | #BBA6FC |
| `var(--dt-color-border-critical-strong)` | #93173A |
| `var(--dt-color-border-success-strong)` | #004F2E |
| `var(--dt-color-border-warning-strong)` | #D57F00 |
| `var(--dt-color-border-brand-strong)` | #5023DD |
| `var(--dt-color-border-subtle-inverted)` | hsl(none 0% 100% / 0.12) |
| `var(--dt-color-border-default-inverted)` | hsl(none 0% 100% / 0.2) |
| `var(--dt-color-border-moderate-inverted)` | hsl(none 0% 100% / 0.35) |
| `var(--dt-color-border-bold-inverted)` | hsl(none 0% 100% / 0.5) |
| `var(--dt-color-border-critical-inverted)` | #FF716F |
| `var(--dt-color-border-success-inverted)` | #52C926 |
| `var(--dt-color-border-warning-inverted)` | #EA8F07 |
| `var(--dt-color-border-brand-inverted)` | #A38FF9 |
| `var(--dt-color-border-critical-subtle-inverted)` | #640823 |
| `var(--dt-color-border-success-subtle-inverted)` | #004F2E |
| `var(--dt-color-border-warning-subtle-inverted)` | #815008 |
| `var(--dt-color-border-brand-subtle-inverted)` | #7C52FF |
| `var(--dt-color-border-critical-strong-inverted)` | #FFABA4 |
| `var(--dt-color-border-success-strong-inverted)` | #84EE0B |
| `var(--dt-color-border-warning-strong-inverted)` | #FFDB80 |
| `var(--dt-color-border-brand-strong-inverted)` | #D3BCFF |
| `var(--dt-color-border-focus)` | #4AA9EA |
| `var(--dt-color-border-ai)` | linear-gradient(135deg, #471571 0%, #551B84 3.08%, #7C229E 14.48%, #9024A4 23.67%, #B02290 35.5%, #D32B86 48.3%, #E92F6F 60.29%, #F6484F 70.08%, #FB7328 90.02%, #F3960F 97.29%, #F3960F 100%) |
| `var(--dt-color-border-accent)` | #FF1BA4 |

### Chart

| Token | Value |
| --- | --- |
| `var(--dt-color-chart-categorical-10)` | #35B7B1 |
| `var(--dt-color-chart-categorical-11)` | #CEC8C4 |
| `var(--dt-color-chart-categorical-12)` | hsl(296.12 97.103% 65.922%) |
| `var(--dt-color-chart-categorical-13)` | hsl(373.6 87.899% 61.549%) |
| `var(--dt-color-chart-categorical-14)` | hsl(234.17 83.706% 64.157%) |
| `var(--dt-color-chart-categorical-15)` | hsl(367.36 99.172% 56.51%) |
| `var(--dt-color-chart-categorical-16)` | hsl(89.448 68.031% 46.98%) |
| `var(--dt-color-chart-categorical-17)` | hsl(318.12 95.942% 69.882%) |
| `var(--dt-color-chart-categorical-18)` | hsl(63.065 80.497% 55.196%) |
| `var(--dt-color-chart-categorical-19)` | hsl(189.53 78.051% 59.078%) |
| `var(--dt-color-chart-categorical-20)` | hsl(224.24 82.207% 62.902%) |
| `var(--dt-color-chart-categorical-21)` | hsl(95.415 71.492% 53.912%) |
| `var(--dt-color-chart-categorical-22)` | hsl(324.07 39.038% 72.957%) |
| `var(--dt-color-chart-categorical-23)` | hsl(317.49 97.724% 63.098%) |
| `var(--dt-color-chart-categorical-24)` | hsl(20.275 91.529% 58.908%) |
| `var(--dt-color-chart-categorical-25)` | hsl(182.84 82.743% 61.469%) |
| `var(--dt-color-chart-categorical-26)` | hsl(353.11 98.759% 58.392%) |
| `var(--dt-color-chart-categorical-27)` | hsl(123.93 71.384% 51.004%) |
| `var(--dt-color-chart-categorical-28)` | hsl(224.24 82.207% 62.902%) |
| `var(--dt-color-chart-categorical-29)` | hsl(391.39 85.665% 57.567%) |
| `var(--dt-color-chart-categorical-30)` | hsl(185.84 71.161% 55.237%) |
| `var(--dt-color-chart-categorical-01)` | #9071FC |
| `var(--dt-color-chart-categorical-01-hover)` | #7C52FF |
| `var(--dt-color-chart-categorical-01-selected)` | #5023DD |
| `var(--dt-color-chart-categorical-02)` | #FC5EA0 |
| `var(--dt-color-chart-categorical-02-hover)` | #FF1BA4 |
| `var(--dt-color-chart-categorical-02-selected)` | #BF0A80 |
| `var(--dt-color-chart-categorical-03)` | #4AA9EA |
| `var(--dt-color-chart-categorical-03-hover)` | #3B96DF |
| `var(--dt-color-chart-categorical-03-selected)` | #1768C6 |
| `var(--dt-color-chart-categorical-04)` | #FF9E0E |
| `var(--dt-color-chart-categorical-04-hover)` | #EA8F07 |
| `var(--dt-color-chart-categorical-04-selected)` | #815008 |
| `var(--dt-color-chart-categorical-05)` | #52C926 |
| `var(--dt-color-chart-categorical-05-hover)` | #2EA834 |
| `var(--dt-color-chart-categorical-05-selected)` | #004F2E |
| `var(--dt-color-chart-categorical-06)` | #FB79F3 |
| `var(--dt-color-chart-categorical-06-hover)` | #F745EE |
| `var(--dt-color-chart-categorical-06-selected)` | #BF05F0 |
| `var(--dt-color-chart-categorical-07)` | #F66437 |
| `var(--dt-color-chart-categorical-07-hover)` | #F44710 |
| `var(--dt-color-chart-categorical-07-selected)` | #A93009 |
| `var(--dt-color-chart-categorical-08)` | #CABF27 |
| `var(--dt-color-chart-categorical-08-hover)` | #B6AC25 |
| `var(--dt-color-chart-categorical-08-selected)` | #6A652A |
| `var(--dt-color-chart-categorical-09)` | #FF415B |
| `var(--dt-color-chart-categorical-09-hover)` | #FF1356 |
| `var(--dt-color-chart-categorical-09-selected)` | #93173A |
| `var(--dt-color-chart-categorical-10-hover)` | #2AA7A1 |
| `var(--dt-color-chart-categorical-10-selected)` | #114D4A |
| `var(--dt-color-chart-categorical-11-hover)` | hsl(24 9.2593% 67%) |
| `var(--dt-color-chart-categorical-11-selected)` | hsl(24 9.2593% 55.176%) |
| `var(--dt-color-chart-categorical-12-hover)` | hsl(296.12 97.103% 56.034%) |
| `var(--dt-color-chart-categorical-12-selected)` | hsl(296.12 97.103% 46.145%) |
| `var(--dt-color-chart-categorical-13-hover)` | hsl(373.6 87.899% 52.317%) |
| `var(--dt-color-chart-categorical-13-selected)` | hsl(373.6 87.899% 43.084%) |
| `var(--dt-color-chart-categorical-14-hover)` | hsl(234.17 83.706% 54.533%) |
| `var(--dt-color-chart-categorical-14-selected)` | hsl(234.17 83.706% 44.91%) |
| `var(--dt-color-chart-categorical-15-hover)` | hsl(367.36 99.172% 48.033%) |
| `var(--dt-color-chart-categorical-15-selected)` | hsl(367.36 99.172% 39.557%) |
| `var(--dt-color-chart-categorical-16-hover)` | hsl(89.448 68.031% 39.933%) |
| `var(--dt-color-chart-categorical-16-selected)` | hsl(89.448 68.031% 32.886%) |
| `var(--dt-color-chart-categorical-17-hover)` | hsl(318.12 95.942% 59.4%) |
| `var(--dt-color-chart-categorical-17-selected)` | hsl(318.12 95.942% 48.917%) |
| `var(--dt-color-chart-categorical-18-hover)` | hsl(63.065 80.497% 46.917%) |
| `var(--dt-color-chart-categorical-18-selected)` | hsl(63.065 80.497% 38.637%) |
| `var(--dt-color-chart-categorical-19-hover)` | hsl(189.53 78.051% 50.216%) |
| `var(--dt-color-chart-categorical-19-selected)` | hsl(189.53 78.051% 41.355%) |
| `var(--dt-color-chart-categorical-20-hover)` | hsl(224.24 82.207% 53.467%) |
| `var(--dt-color-chart-categorical-20-selected)` | hsl(224.24 82.207% 44.031%) |
| `var(--dt-color-chart-categorical-21-hover)` | hsl(95.415 71.492% 45.825%) |
| `var(--dt-color-chart-categorical-21-selected)` | hsl(95.415 71.492% 37.738%) |
| `var(--dt-color-chart-categorical-22-hover)` | hsl(324.07 39.038% 62.013%) |
| `var(--dt-color-chart-categorical-22-selected)` | hsl(324.07 39.038% 51.07%) |
| `var(--dt-color-chart-categorical-23-hover)` | hsl(317.49 97.724% 53.633%) |
| `var(--dt-color-chart-categorical-23-selected)` | hsl(317.49 97.724% 44.169%) |
| `var(--dt-color-chart-categorical-24-hover)` | hsl(20.275 91.529% 50.072%) |
| `var(--dt-color-chart-categorical-24-selected)` | hsl(20.275 91.529% 41.236%) |
| `var(--dt-color-chart-categorical-25-hover)` | hsl(182.84 82.743% 52.249%) |
| `var(--dt-color-chart-categorical-25-selected)` | hsl(182.84 82.743% 43.028%) |
| `var(--dt-color-chart-categorical-26-hover)` | hsl(353.11 98.759% 49.633%) |
| `var(--dt-color-chart-categorical-26-selected)` | hsl(353.11 98.759% 40.874%) |
| `var(--dt-color-chart-categorical-27-hover)` | hsl(123.93 71.384% 43.353%) |
| `var(--dt-color-chart-categorical-27-selected)` | hsl(123.93 71.384% 35.703%) |
| `var(--dt-color-chart-categorical-28-hover)` | hsl(224.24 82.207% 53.467%) |
| `var(--dt-color-chart-categorical-28-selected)` | hsl(224.24 82.207% 44.031%) |
| `var(--dt-color-chart-categorical-29-hover)` | hsl(391.39 85.665% 48.932%) |
| `var(--dt-color-chart-categorical-29-selected)` | hsl(391.39 85.665% 40.297%) |
| `var(--dt-color-chart-categorical-30-hover)` | hsl(185.84 71.161% 46.951%) |
| `var(--dt-color-chart-categorical-30-selected)` | hsl(185.84 71.161% 38.666%) |
| `var(--dt-color-chart-neutral)` | #CEC8C4 |
| `var(--dt-color-chart-neutral-hover)` | #AAA4A1 |
| `var(--dt-color-chart-neutral-selected)` | #635F5D |
| `var(--dt-color-chart-accent)` | #6EA6E2 |
| `var(--dt-color-chart-accent-hover)` | #5699D7 |
| `var(--dt-color-chart-accent-selected)` | #296FA3 |
| `var(--dt-color-chart-positive)` | #52C926 |
| `var(--dt-color-chart-positive-hover)` | #2EA834 |
| `var(--dt-color-chart-positive-selected)` | #004F2E |
| `var(--dt-color-chart-critical)` | #FF1356 |
| `var(--dt-color-chart-critical-hover)` | #D90A45 |
| `var(--dt-color-chart-critical-selected)` | #93173A |
| `var(--dt-color-chart-warning-hover)` | #D57F00 |
| `var(--dt-color-chart-warning)` | #FF9E0E |
| `var(--dt-color-chart-warning-selected)` | #815008 |
| `var(--dt-color-chart-info)` | #4AA9EA |
| `var(--dt-color-chart-info-hover)` | #3B96DF |
| `var(--dt-color-chart-info-selected)` | #1768C6 |
| `var(--dt-color-chart-sequential-10)` | #143A52 |
| `var(--dt-color-chart-sequential-01)` | #ECF0F9 |
| `var(--dt-color-chart-sequential-01-hover)` | hsl(221.54 44.2% 80.833%) |
| `var(--dt-color-chart-sequential-01-selected)` | hsl(221.54 36.4% 66.569%) |
| `var(--dt-color-chart-sequential-02)` | hsl(219.71 52.878% 87.588%) |
| `var(--dt-color-chart-sequential-02-hover)` | hsl(219.71 44.946% 74.45%) |
| `var(--dt-color-chart-sequential-02-selected)` | hsl(219.71 37.015% 61.312%) |
| `var(--dt-color-chart-sequential-03)` | hsl(217.69 53.845% 79.327%) |
| `var(--dt-color-chart-sequential-03-hover)` | hsl(217.69 45.768% 67.428%) |
| `var(--dt-color-chart-sequential-03-selected)` | hsl(217.69 37.692% 55.529%) |
| `var(--dt-color-chart-sequential-04)` | hsl(215.5 54.899% 70.316%) |
| `var(--dt-color-chart-sequential-04-hover)` | hsl(215.5 46.664% 59.769%) |
| `var(--dt-color-chart-sequential-04-selected)` | hsl(215.5 38.429% 49.221%) |
| `var(--dt-color-chart-sequential-05)` | hsl(213.48 55.865% 62.055%) |
| `var(--dt-color-chart-sequential-05-hover)` | hsl(213.48 47.485% 52.747%) |
| `var(--dt-color-chart-sequential-05-selected)` | hsl(213.48 39.105% 43.439%) |
| `var(--dt-color-chart-sequential-06)` | hsl(211.28 56.919% 53.043%) |
| `var(--dt-color-chart-sequential-06-hover)` | hsl(211.28 48.381% 45.087%) |
| `var(--dt-color-chart-sequential-06-selected)` | hsl(211.28 39.843% 37.13%) |
| `var(--dt-color-chart-sequential-07)` | hsl(209.27 57.885% 44.782%) |
| `var(--dt-color-chart-sequential-07-hover)` | hsl(209.27 49.202% 38.065%) |
| `var(--dt-color-chart-sequential-07-selected)` | hsl(209.27 40.52% 31.347%) |
| `var(--dt-color-chart-sequential-08)` | hsl(207.07 58.94% 35.771%) |
| `var(--dt-color-chart-sequential-08-hover)` | hsl(207.07 50.099% 30.405%) |
| `var(--dt-color-chart-sequential-08-selected)` | hsl(207.07 41.258% 25.04%) |
| `var(--dt-color-chart-sequential-09)` | hsl(205.06 59.906% 27.51%) |
| `var(--dt-color-chart-sequential-09-hover)` | hsl(205.06 50.92% 23.384%) |
| `var(--dt-color-chart-sequential-09-selected)` | hsl(205.06 41.934% 19.257%) |
| `var(--dt-color-chart-sequential-10-hover)` | hsl(203.23 51.667% 17%) |
| `var(--dt-color-chart-sequential-10-selected)` | hsl(203.23 42.549% 14%) |
| `var(--dt-color-chart-sequential-range-00-start)` | #ECF0F9 |
| `var(--dt-color-chart-sequential-range-00-end)` | #143A52 |
| `var(--dt-color-chart-sequential-range-01-start)` | #F5F0FF |
| `var(--dt-color-chart-sequential-range-01-end)` | #3A1D95 |
| `var(--dt-color-chart-sequential-range-02-start)` | #FFE0F2 |
| `var(--dt-color-chart-sequential-range-02-end)` | #662251 |
| `var(--dt-color-chart-sequential-range-03-start)` | #EAF2FA |
| `var(--dt-color-chart-sequential-range-03-end)` | #003165 |
| `var(--dt-color-chart-sequential-range-04-start)` | #FFFAE5 |
| `var(--dt-color-chart-sequential-range-04-end)` | #815008 |
| `var(--dt-color-chart-sequential-range-05-start)` | #EDF9EB |
| `var(--dt-color-chart-sequential-range-05-end)` | #004F2E |
| `var(--dt-color-chart-sequential-range-06-start)` | #FFE6FD |
| `var(--dt-color-chart-sequential-range-06-end)` | #511E76 |
| `var(--dt-color-chart-sequential-range-07-start)` | #FBEEE9 |
| `var(--dt-color-chart-sequential-range-07-end)` | #651E06 |
| `var(--dt-color-chart-sequential-range-08-start)` | #FDF1C3 |
| `var(--dt-color-chart-sequential-range-08-end)` | #4D480F |
| `var(--dt-color-chart-sequential-range-09-start)` | #FFE5E6 |
| `var(--dt-color-chart-sequential-range-09-end)` | #640823 |
| `var(--dt-color-chart-sequential-range-10-start)` | #ECF9F8 |
| `var(--dt-color-chart-sequential-range-10-end)` | #114D4A |

## Typography

### Body

| Token | Value |
| --- | --- |
| `var(--dt-typography-body-md-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-typography-body-md-font-weight)` | 400 |
| `var(--dt-typography-body-md-line-height)` | 1.6 |
| `var(--dt-typography-body-md-font-size)` | 16px |
| `var(--dt-typography-body-md-text-case)` | none |
| `var(--dt-typography-body-md-compact-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-typography-body-md-compact-font-weight)` | 400 |
| `var(--dt-typography-body-md-compact-line-height)` | 1.4 |
| `var(--dt-typography-body-md-compact-font-size)` | 16px |
| `var(--dt-typography-body-md-compact-text-case)` | none |
| `var(--dt-typography-body-sm-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-typography-body-sm-font-weight)` | 400 |
| `var(--dt-typography-body-sm-line-height)` | 1.4 |
| `var(--dt-typography-body-sm-font-size)` | 12px |
| `var(--dt-typography-body-sm-text-case)` | none |
| `var(--dt-typography-body-sm-compact-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-typography-body-sm-compact-font-weight)` | 400 |
| `var(--dt-typography-body-sm-compact-line-height)` | 1.2 |
| `var(--dt-typography-body-sm-compact-font-size)` | 12px |
| `var(--dt-typography-body-sm-compact-text-case)` | none |
| `var(--dt-typography-body-md)` | var(--dt-typography-body-md-font-weight) var(--dt-typography-body-md-font-size)/var(--dt-typography-body-md-line-height) var(--dt-typography-body-md-font-family) |
| `var(--dt-typography-body-md-compact)` | var(--dt-typography-body-md-compact-font-weight) var(--dt-typography-body-md-compact-font-size)/var(--dt-typography-body-md-compact-line-height) var(--dt-typography-body-md-compact-font-family) |
| `var(--dt-typography-body-sm)` | var(--dt-typography-body-sm-font-weight) var(--dt-typography-body-sm-font-size)/var(--dt-typography-body-sm-line-height) var(--dt-typography-body-sm-font-family) |
| `var(--dt-typography-body-sm-compact)` | var(--dt-typography-body-sm-compact-font-weight) var(--dt-typography-body-sm-compact-font-size)/var(--dt-typography-body-sm-compact-line-height) var(--dt-typography-body-sm-compact-font-family) |

### Headline

| Token | Value |
| --- | --- |
| `var(--dt-typography-headline-eyebrow-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-typography-headline-eyebrow-font-weight)` | 400 |
| `var(--dt-typography-headline-eyebrow-line-height)` | 1.4 |
| `var(--dt-typography-headline-eyebrow-font-size)` | 12px |
| `var(--dt-typography-headline-eyebrow-text-case)` | uppercase |
| `var(--dt-typography-headline-sm-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-typography-headline-sm-font-weight)` | 700 |
| `var(--dt-typography-headline-sm-line-height)` | 1.4 |
| `var(--dt-typography-headline-sm-font-size)` | 12px |
| `var(--dt-typography-headline-sm-text-case)` | none |
| `var(--dt-typography-headline-sm-compact-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-typography-headline-sm-compact-font-weight)` | 700 |
| `var(--dt-typography-headline-sm-compact-line-height)` | 1.2 |
| `var(--dt-typography-headline-sm-compact-font-size)` | 12px |
| `var(--dt-typography-headline-sm-compact-text-case)` | none |
| `var(--dt-typography-headline-sm-soft-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-typography-headline-sm-soft-font-weight)` | 500 |
| `var(--dt-typography-headline-sm-soft-line-height)` | 1.4 |
| `var(--dt-typography-headline-sm-soft-font-size)` | 12px |
| `var(--dt-typography-headline-sm-soft-text-case)` | none |
| `var(--dt-typography-headline-sm-soft-compact-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-typography-headline-sm-soft-compact-font-weight)` | 500 |
| `var(--dt-typography-headline-sm-soft-compact-line-height)` | 1.2 |
| `var(--dt-typography-headline-sm-soft-compact-font-size)` | 12px |
| `var(--dt-typography-headline-sm-soft-compact-text-case)` | none |
| `var(--dt-typography-headline-md-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-typography-headline-md-font-weight)` | 700 |
| `var(--dt-typography-headline-md-line-height)` | 1.6 |
| `var(--dt-typography-headline-md-font-size)` | 16px |
| `var(--dt-typography-headline-md-text-case)` | none |
| `var(--dt-typography-headline-md-compact-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-typography-headline-md-compact-font-weight)` | 700 |
| `var(--dt-typography-headline-md-compact-line-height)` | 1.4 |
| `var(--dt-typography-headline-md-compact-font-size)` | 16px |
| `var(--dt-typography-headline-md-compact-text-case)` | none |
| `var(--dt-typography-headline-lg-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-typography-headline-lg-font-weight)` | 700 |
| `var(--dt-typography-headline-lg-line-height)` | 1.6 |
| `var(--dt-typography-headline-lg-font-size)` | 20px |
| `var(--dt-typography-headline-lg-text-case)` | none |
| `var(--dt-typography-headline-lg-soft-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-typography-headline-lg-soft-font-weight)` | 500 |
| `var(--dt-typography-headline-lg-soft-line-height)` | 1.6 |
| `var(--dt-typography-headline-lg-soft-font-size)` | 20px |
| `var(--dt-typography-headline-lg-soft-text-case)` | none |
| `var(--dt-typography-headline-lg-compact-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-typography-headline-lg-compact-font-weight)` | 700 |
| `var(--dt-typography-headline-lg-compact-line-height)` | 1.2 |
| `var(--dt-typography-headline-lg-compact-font-size)` | 20px |
| `var(--dt-typography-headline-lg-compact-text-case)` | none |
| `var(--dt-typography-headline-lg-soft-compact-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-typography-headline-lg-soft-compact-font-weight)` | 500 |
| `var(--dt-typography-headline-lg-soft-compact-line-height)` | 1.2 |
| `var(--dt-typography-headline-lg-soft-compact-font-size)` | 20px |
| `var(--dt-typography-headline-lg-soft-compact-text-case)` | none |
| `var(--dt-typography-headline-xl-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-typography-headline-xl-font-weight)` | 700 |
| `var(--dt-typography-headline-xl-line-height)` | 1.2 |
| `var(--dt-typography-headline-xl-font-size)` | 28px |
| `var(--dt-typography-headline-xl-text-case)` | none |
| `var(--dt-typography-headline-xl-compact-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-typography-headline-xl-compact-font-weight)` | 700 |
| `var(--dt-typography-headline-xl-compact-line-height)` | 1 |
| `var(--dt-typography-headline-xl-compact-font-size)` | 28px |
| `var(--dt-typography-headline-xl-compact-text-case)` | none |
| `var(--dt-typography-headline-xxl-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-typography-headline-xxl-font-weight)` | 700 |
| `var(--dt-typography-headline-xxl-line-height)` | 1.2 |
| `var(--dt-typography-headline-xxl-font-size)` | 32px |
| `var(--dt-typography-headline-xxl-text-case)` | none |
| `var(--dt-typography-headline-xxl-compact-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-typography-headline-xxl-compact-font-weight)` | 700 |
| `var(--dt-typography-headline-xxl-compact-line-height)` | 1.2 |
| `var(--dt-typography-headline-xxl-compact-font-size)` | 32px |
| `var(--dt-typography-headline-xxl-compact-text-case)` | none |
| `var(--dt-typography-headline-eyebrow)` | var(--dt-typography-headline-eyebrow-font-weight) var(--dt-typography-headline-eyebrow-font-size)/var(--dt-typography-headline-eyebrow-line-height) var(--dt-typography-headline-eyebrow-font-family) |
| `var(--dt-typography-headline-sm)` | var(--dt-typography-headline-sm-font-weight) var(--dt-typography-headline-sm-font-size)/var(--dt-typography-headline-sm-line-height) var(--dt-typography-headline-sm-font-family) |
| `var(--dt-typography-headline-sm-compact)` | var(--dt-typography-headline-sm-compact-font-weight) var(--dt-typography-headline-sm-compact-font-size)/var(--dt-typography-headline-sm-compact-line-height) var(--dt-typography-headline-sm-compact-font-family) |
| `var(--dt-typography-headline-sm-soft)` | var(--dt-typography-headline-sm-soft-font-weight) var(--dt-typography-headline-sm-soft-font-size)/var(--dt-typography-headline-sm-soft-line-height) var(--dt-typography-headline-sm-soft-font-family) |
| `var(--dt-typography-headline-sm-soft-compact)` | var(--dt-typography-headline-sm-soft-compact-font-weight) var(--dt-typography-headline-sm-soft-compact-font-size)/var(--dt-typography-headline-sm-soft-compact-line-height) var(--dt-typography-headline-sm-soft-compact-font-family) |
| `var(--dt-typography-headline-md)` | var(--dt-typography-headline-md-font-weight) var(--dt-typography-headline-md-font-size)/var(--dt-typography-headline-md-line-height) var(--dt-typography-headline-md-font-family) |
| `var(--dt-typography-headline-md-compact)` | var(--dt-typography-headline-md-compact-font-weight) var(--dt-typography-headline-md-compact-font-size)/var(--dt-typography-headline-md-compact-line-height) var(--dt-typography-headline-md-compact-font-family) |
| `var(--dt-typography-headline-lg)` | var(--dt-typography-headline-lg-font-weight) var(--dt-typography-headline-lg-font-size)/var(--dt-typography-headline-lg-line-height) var(--dt-typography-headline-lg-font-family) |
| `var(--dt-typography-headline-lg-soft)` | var(--dt-typography-headline-lg-soft-font-weight) var(--dt-typography-headline-lg-soft-font-size)/var(--dt-typography-headline-lg-soft-line-height) var(--dt-typography-headline-lg-soft-font-family) |
| `var(--dt-typography-headline-lg-compact)` | var(--dt-typography-headline-lg-compact-font-weight) var(--dt-typography-headline-lg-compact-font-size)/var(--dt-typography-headline-lg-compact-line-height) var(--dt-typography-headline-lg-compact-font-family) |
| `var(--dt-typography-headline-lg-soft-compact)` | var(--dt-typography-headline-lg-soft-compact-font-weight) var(--dt-typography-headline-lg-soft-compact-font-size)/var(--dt-typography-headline-lg-soft-compact-line-height) var(--dt-typography-headline-lg-soft-compact-font-family) |
| `var(--dt-typography-headline-xl)` | var(--dt-typography-headline-xl-font-weight) var(--dt-typography-headline-xl-font-size)/var(--dt-typography-headline-xl-line-height) var(--dt-typography-headline-xl-font-family) |
| `var(--dt-typography-headline-xl-compact)` | var(--dt-typography-headline-xl-compact-font-weight) var(--dt-typography-headline-xl-compact-font-size)/var(--dt-typography-headline-xl-compact-line-height) var(--dt-typography-headline-xl-compact-font-family) |
| `var(--dt-typography-headline-xxl)` | var(--dt-typography-headline-xxl-font-weight) var(--dt-typography-headline-xxl-font-size)/var(--dt-typography-headline-xxl-line-height) var(--dt-typography-headline-xxl-font-family) |
| `var(--dt-typography-headline-xxl-compact)` | var(--dt-typography-headline-xxl-compact-font-weight) var(--dt-typography-headline-xxl-compact-font-size)/var(--dt-typography-headline-xxl-compact-line-height) var(--dt-typography-headline-xxl-compact-font-family) |

### Label

| Token | Value |
| --- | --- |
| `var(--dt-typography-label-md-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-typography-label-md-font-weight)` | 600 |
| `var(--dt-typography-label-md-line-height)` | 1.6 |
| `var(--dt-typography-label-md-font-size)` | 16px |
| `var(--dt-typography-label-md-text-case)` | none |
| `var(--dt-typography-label-md-compact-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-typography-label-md-compact-font-weight)` | 600 |
| `var(--dt-typography-label-md-compact-line-height)` | 1.4 |
| `var(--dt-typography-label-md-compact-font-size)` | 16px |
| `var(--dt-typography-label-md-compact-text-case)` | none |
| `var(--dt-typography-label-md-plain-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-typography-label-md-plain-font-weight)` | 400 |
| `var(--dt-typography-label-md-plain-line-height)` | 1.6 |
| `var(--dt-typography-label-md-plain-font-size)` | 16px |
| `var(--dt-typography-label-md-plain-text-case)` | none |
| `var(--dt-typography-label-md-plain-compact-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-typography-label-md-plain-compact-font-weight)` | 400 |
| `var(--dt-typography-label-md-plain-compact-line-height)` | 1.4 |
| `var(--dt-typography-label-md-plain-compact-font-size)` | 16px |
| `var(--dt-typography-label-md-plain-compact-text-case)` | none |
| `var(--dt-typography-label-sm-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-typography-label-sm-font-weight)` | 600 |
| `var(--dt-typography-label-sm-line-height)` | 1.4 |
| `var(--dt-typography-label-sm-font-size)` | 12px |
| `var(--dt-typography-label-sm-text-case)` | none |
| `var(--dt-typography-label-sm-compact-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-typography-label-sm-compact-font-weight)` | 600 |
| `var(--dt-typography-label-sm-compact-line-height)` | 1.2 |
| `var(--dt-typography-label-sm-compact-font-size)` | 12px |
| `var(--dt-typography-label-sm-compact-text-case)` | none |
| `var(--dt-typography-label-sm-plain-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-typography-label-sm-plain-font-weight)` | 400 |
| `var(--dt-typography-label-sm-plain-line-height)` | 1.4 |
| `var(--dt-typography-label-sm-plain-font-size)` | 12px |
| `var(--dt-typography-label-sm-plain-text-case)` | none |
| `var(--dt-typography-label-sm-plain-compact-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-typography-label-sm-plain-compact-font-weight)` | 400 |
| `var(--dt-typography-label-sm-plain-compact-line-height)` | 1.2 |
| `var(--dt-typography-label-sm-plain-compact-font-size)` | 12px |
| `var(--dt-typography-label-sm-plain-compact-text-case)` | none |
| `var(--dt-typography-label-md)` | var(--dt-typography-label-md-font-weight) var(--dt-typography-label-md-font-size)/var(--dt-typography-label-md-line-height) var(--dt-typography-label-md-font-family) |
| `var(--dt-typography-label-md-compact)` | var(--dt-typography-label-md-compact-font-weight) var(--dt-typography-label-md-compact-font-size)/var(--dt-typography-label-md-compact-line-height) var(--dt-typography-label-md-compact-font-family) |
| `var(--dt-typography-label-md-plain)` | var(--dt-typography-label-md-plain-font-weight) var(--dt-typography-label-md-plain-font-size)/var(--dt-typography-label-md-plain-line-height) var(--dt-typography-label-md-plain-font-family) |
| `var(--dt-typography-label-md-plain-compact)` | var(--dt-typography-label-md-plain-compact-font-weight) var(--dt-typography-label-md-plain-compact-font-size)/var(--dt-typography-label-md-plain-compact-line-height) var(--dt-typography-label-md-plain-compact-font-family) |
| `var(--dt-typography-label-sm)` | var(--dt-typography-label-sm-font-weight) var(--dt-typography-label-sm-font-size)/var(--dt-typography-label-sm-line-height) var(--dt-typography-label-sm-font-family) |
| `var(--dt-typography-label-sm-compact)` | var(--dt-typography-label-sm-compact-font-weight) var(--dt-typography-label-sm-compact-font-size)/var(--dt-typography-label-sm-compact-line-height) var(--dt-typography-label-sm-compact-font-family) |
| `var(--dt-typography-label-sm-plain)` | var(--dt-typography-label-sm-plain-font-weight) var(--dt-typography-label-sm-plain-font-size)/var(--dt-typography-label-sm-plain-line-height) var(--dt-typography-label-sm-plain-font-family) |
| `var(--dt-typography-label-sm-plain-compact)` | var(--dt-typography-label-sm-plain-compact-font-weight) var(--dt-typography-label-sm-plain-compact-font-size)/var(--dt-typography-label-sm-plain-compact-line-height) var(--dt-typography-label-sm-plain-compact-font-family) |

### Helper

| Token | Value |
| --- | --- |
| `var(--dt-typography-helper-md-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-typography-helper-md-font-weight)` | 400 |
| `var(--dt-typography-helper-md-line-height)` | 1.4 |
| `var(--dt-typography-helper-md-font-size)` | 16px |
| `var(--dt-typography-helper-md-text-case)` | none |
| `var(--dt-typography-helper-sm-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-typography-helper-sm-font-weight)` | 400 |
| `var(--dt-typography-helper-sm-line-height)` | 1.2 |
| `var(--dt-typography-helper-sm-font-size)` | 12px |
| `var(--dt-typography-helper-sm-text-case)` | none |
| `var(--dt-typography-helper-md)` | var(--dt-typography-helper-md-font-weight) var(--dt-typography-helper-md-font-size)/var(--dt-typography-helper-md-line-height) var(--dt-typography-helper-md-font-family) |
| `var(--dt-typography-helper-sm)` | var(--dt-typography-helper-sm-font-weight) var(--dt-typography-helper-sm-font-size)/var(--dt-typography-helper-sm-line-height) var(--dt-typography-helper-sm-font-family) |

### Code

| Token | Value |
| --- | --- |
| `var(--dt-typography-code-md-font-family)` | SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, Courier, monospace |
| `var(--dt-typography-code-md-font-weight)` | 400 |
| `var(--dt-typography-code-md-line-height)` | 1.2 |
| `var(--dt-typography-code-md-font-size)` | 14px |
| `var(--dt-typography-code-md-text-case)` | none |
| `var(--dt-typography-code-sm-font-family)` | SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, Courier, monospace |
| `var(--dt-typography-code-sm-font-weight)` | 400 |
| `var(--dt-typography-code-sm-line-height)` | 1.2 |
| `var(--dt-typography-code-sm-font-size)` | 11px |
| `var(--dt-typography-code-sm-text-case)` | none |
| `var(--dt-typography-code-md)` | var(--dt-typography-code-md-font-weight) var(--dt-typography-code-md-font-size)/var(--dt-typography-code-md-line-height) var(--dt-typography-code-md-font-family) |
| `var(--dt-typography-code-sm)` | var(--dt-typography-code-sm-font-weight) var(--dt-typography-code-sm-font-size)/var(--dt-typography-code-sm-line-height) var(--dt-typography-code-sm-font-family) |

### Inputs

| Token | Value |
| --- | --- |
| `var(--dt-typography-inputs-xs-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-typography-inputs-xs-font-weight)` | 400 |
| `var(--dt-typography-inputs-xs-font-size)` | 12px |
| `var(--dt-typography-inputs-xs-line-height)` | 1.2 |
| `var(--dt-typography-inputs-sm-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-typography-inputs-sm-font-weight)` | 400 |
| `var(--dt-typography-inputs-sm-font-size)` | 12px |
| `var(--dt-typography-inputs-sm-line-height)` | 1.2 |
| `var(--dt-typography-inputs-md-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-typography-inputs-md-font-weight)` | 400 |
| `var(--dt-typography-inputs-md-font-size)` | 16px |
| `var(--dt-typography-inputs-md-line-height)` | 1.2 |
| `var(--dt-typography-inputs-lg-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-typography-inputs-lg-font-weight)` | 400 |
| `var(--dt-typography-inputs-lg-font-size)` | 20px |
| `var(--dt-typography-inputs-lg-line-height)` | 1.2 |
| `var(--dt-typography-inputs-xl-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-typography-inputs-xl-font-weight)` | 400 |
| `var(--dt-typography-inputs-xl-font-size)` | 28px |
| `var(--dt-typography-inputs-xl-line-height)` | 1.2 |
| `var(--dt-typography-inputs-xs)` | var(--dt-typography-inputs-xs-font-weight) var(--dt-typography-inputs-xs-font-size)/var(--dt-typography-inputs-xs-line-height) var(--dt-typography-inputs-xs-font-family) |
| `var(--dt-typography-inputs-sm)` | var(--dt-typography-inputs-sm-font-weight) var(--dt-typography-inputs-sm-font-size)/var(--dt-typography-inputs-sm-line-height) var(--dt-typography-inputs-sm-font-family) |
| `var(--dt-typography-inputs-md)` | var(--dt-typography-inputs-md-font-weight) var(--dt-typography-inputs-md-font-size)/var(--dt-typography-inputs-md-line-height) var(--dt-typography-inputs-md-font-family) |
| `var(--dt-typography-inputs-lg)` | var(--dt-typography-inputs-lg-font-weight) var(--dt-typography-inputs-lg-font-size)/var(--dt-typography-inputs-lg-line-height) var(--dt-typography-inputs-lg-font-family) |
| `var(--dt-typography-inputs-xl)` | var(--dt-typography-inputs-xl-font-weight) var(--dt-typography-inputs-xl-font-size)/var(--dt-typography-inputs-xl-line-height) var(--dt-typography-inputs-xl-font-family) |

### Button

| Token | Value |
| --- | --- |
| `var(--dt-typography-button-xs-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-typography-button-xs-font-weight)` | 600 |
| `var(--dt-typography-button-xs-font-size)` | 12px |
| `var(--dt-typography-button-xs-line-height)` | 1.2 |
| `var(--dt-typography-button-sm-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-typography-button-sm-font-weight)` | 600 |
| `var(--dt-typography-button-sm-font-size)` | 12px |
| `var(--dt-typography-button-sm-line-height)` | 1.2 |
| `var(--dt-typography-button-md-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-typography-button-md-font-weight)` | 600 |
| `var(--dt-typography-button-md-font-size)` | 16px |
| `var(--dt-typography-button-md-line-height)` | 1.2 |
| `var(--dt-typography-button-lg-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-typography-button-lg-font-weight)` | 500 |
| `var(--dt-typography-button-lg-font-size)` | 20px |
| `var(--dt-typography-button-lg-line-height)` | 1.2 |
| `var(--dt-typography-button-xl-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-typography-button-xl-font-weight)` | 400 |
| `var(--dt-typography-button-xl-font-size)` | 28px |
| `var(--dt-typography-button-xl-line-height)` | 1.2 |
| `var(--dt-typography-button-xs)` | var(--dt-typography-button-xs-font-weight) var(--dt-typography-button-xs-font-size)/var(--dt-typography-button-xs-line-height) var(--dt-typography-button-xs-font-family) |
| `var(--dt-typography-button-sm)` | var(--dt-typography-button-sm-font-weight) var(--dt-typography-button-sm-font-size)/var(--dt-typography-button-sm-line-height) var(--dt-typography-button-sm-font-family) |
| `var(--dt-typography-button-md)` | var(--dt-typography-button-md-font-weight) var(--dt-typography-button-md-font-size)/var(--dt-typography-button-md-line-height) var(--dt-typography-button-md-font-family) |
| `var(--dt-typography-button-lg)` | var(--dt-typography-button-lg-font-weight) var(--dt-typography-button-lg-font-size)/var(--dt-typography-button-lg-line-height) var(--dt-typography-button-lg-font-family) |
| `var(--dt-typography-button-xl)` | var(--dt-typography-button-xl-font-weight) var(--dt-typography-button-xl-font-size)/var(--dt-typography-button-xl-line-height) var(--dt-typography-button-xl-font-family) |

## Text

### Headline

| Token | Value |
| --- | --- |
| `var(--dt-text-headline-3xl-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-text-headline-3xl-font-weight)` | 700 |
| `var(--dt-text-headline-3xl-font-size)` | 32px |
| `var(--dt-text-headline-3xl-line-height)` | 1.2 |
| `var(--dt-text-headline-2xl-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-text-headline-2xl-font-weight)` | 700 |
| `var(--dt-text-headline-2xl-font-size)` | 28px |
| `var(--dt-text-headline-2xl-line-height)` | 1.2 |
| `var(--dt-text-headline-xl-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-text-headline-xl-font-weight)` | 700 |
| `var(--dt-text-headline-xl-font-size)` | 20px |
| `var(--dt-text-headline-xl-line-height)` | 1.6 |
| `var(--dt-text-headline-lg-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-text-headline-lg-font-weight)` | 700 |
| `var(--dt-text-headline-lg-font-size)` | 18px |
| `var(--dt-text-headline-lg-line-height)` | 1.4 |
| `var(--dt-text-headline-md-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-text-headline-md-font-weight)` | 700 |
| `var(--dt-text-headline-md-font-size)` | 16px |
| `var(--dt-text-headline-md-line-height)` | 1.6 |
| `var(--dt-text-headline-sm-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-text-headline-sm-font-weight)` | 700 |
| `var(--dt-text-headline-sm-font-size)` | 14px |
| `var(--dt-text-headline-sm-line-height)` | 1.4 |
| `var(--dt-text-headline-xs-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-text-headline-xs-font-weight)` | 700 |
| `var(--dt-text-headline-xs-font-size)` | 12px |
| `var(--dt-text-headline-xs-line-height)` | 1.4 |
| `var(--dt-text-headline-3xl)` | var(--dt-text-headline-3xl-font-weight) var(--dt-text-headline-3xl-font-size)/var(--dt-text-headline-3xl-line-height) var(--dt-text-headline-3xl-font-family) |
| `var(--dt-text-headline-2xl)` | var(--dt-text-headline-2xl-font-weight) var(--dt-text-headline-2xl-font-size)/var(--dt-text-headline-2xl-line-height) var(--dt-text-headline-2xl-font-family) |
| `var(--dt-text-headline-xl)` | var(--dt-text-headline-xl-font-weight) var(--dt-text-headline-xl-font-size)/var(--dt-text-headline-xl-line-height) var(--dt-text-headline-xl-font-family) |
| `var(--dt-text-headline-lg)` | var(--dt-text-headline-lg-font-weight) var(--dt-text-headline-lg-font-size)/var(--dt-text-headline-lg-line-height) var(--dt-text-headline-lg-font-family) |
| `var(--dt-text-headline-md)` | var(--dt-text-headline-md-font-weight) var(--dt-text-headline-md-font-size)/var(--dt-text-headline-md-line-height) var(--dt-text-headline-md-font-family) |
| `var(--dt-text-headline-sm)` | var(--dt-text-headline-sm-font-weight) var(--dt-text-headline-sm-font-size)/var(--dt-text-headline-sm-line-height) var(--dt-text-headline-sm-font-family) |
| `var(--dt-text-headline-xs)` | var(--dt-text-headline-xs-font-weight) var(--dt-text-headline-xs-font-size)/var(--dt-text-headline-xs-line-height) var(--dt-text-headline-xs-font-family) |

### Body

| Token | Value |
| --- | --- |
| `var(--dt-text-body-lg-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-text-body-lg-font-weight)` | 400 |
| `var(--dt-text-body-lg-font-size)` | 18px |
| `var(--dt-text-body-lg-line-height)` | 1.6 |
| `var(--dt-text-body-md-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-text-body-md-font-weight)` | 400 |
| `var(--dt-text-body-md-font-size)` | 16px |
| `var(--dt-text-body-md-line-height)` | 1.6 |
| `var(--dt-text-body-sm-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-text-body-sm-font-weight)` | 400 |
| `var(--dt-text-body-sm-font-size)` | 14px |
| `var(--dt-text-body-sm-line-height)` | 1.4 |
| `var(--dt-text-body-xs-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-text-body-xs-font-weight)` | 400 |
| `var(--dt-text-body-xs-font-size)` | 12px |
| `var(--dt-text-body-xs-line-height)` | 1.4 |
| `var(--dt-text-body-lg)` | var(--dt-text-body-lg-font-weight) var(--dt-text-body-lg-font-size)/var(--dt-text-body-lg-line-height) var(--dt-text-body-lg-font-family) |
| `var(--dt-text-body-md)` | var(--dt-text-body-md-font-weight) var(--dt-text-body-md-font-size)/var(--dt-text-body-md-line-height) var(--dt-text-body-md-font-family) |
| `var(--dt-text-body-sm)` | var(--dt-text-body-sm-font-weight) var(--dt-text-body-sm-font-size)/var(--dt-text-body-sm-line-height) var(--dt-text-body-sm-font-family) |
| `var(--dt-text-body-xs)` | var(--dt-text-body-xs-font-weight) var(--dt-text-body-xs-font-size)/var(--dt-text-body-xs-line-height) var(--dt-text-body-xs-font-family) |

### Label

| Token | Value |
| --- | --- |
| `var(--dt-text-label-lg-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-text-label-lg-font-weight)` | 600 |
| `var(--dt-text-label-lg-font-size)` | 18px |
| `var(--dt-text-label-lg-line-height)` | 1.4 |
| `var(--dt-text-label-md-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-text-label-md-font-weight)` | 600 |
| `var(--dt-text-label-md-font-size)` | 16px |
| `var(--dt-text-label-md-line-height)` | 1.6 |
| `var(--dt-text-label-sm-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-text-label-sm-font-weight)` | 600 |
| `var(--dt-text-label-sm-font-size)` | 14px |
| `var(--dt-text-label-sm-line-height)` | 1.6 |
| `var(--dt-text-label-xs-font-family)` | -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" |
| `var(--dt-text-label-xs-font-weight)` | 600 |
| `var(--dt-text-label-xs-font-size)` | 12px |
| `var(--dt-text-label-xs-line-height)` | 1.4 |
| `var(--dt-text-label-lg)` | var(--dt-text-label-lg-font-weight) var(--dt-text-label-lg-font-size)/var(--dt-text-label-lg-line-height) var(--dt-text-label-lg-font-family) |
| `var(--dt-text-label-md)` | var(--dt-text-label-md-font-weight) var(--dt-text-label-md-font-size)/var(--dt-text-label-md-line-height) var(--dt-text-label-md-font-family) |
| `var(--dt-text-label-sm)` | var(--dt-text-label-sm-font-weight) var(--dt-text-label-sm-font-size)/var(--dt-text-label-sm-line-height) var(--dt-text-label-sm-font-family) |
| `var(--dt-text-label-xs)` | var(--dt-text-label-xs-font-weight) var(--dt-text-label-xs-font-size)/var(--dt-text-label-xs-line-height) var(--dt-text-label-xs-font-family) |

### Code

| Token | Value |
| --- | --- |
| `var(--dt-text-code-lg-font-family)` | SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, Courier, monospace |
| `var(--dt-text-code-lg-font-weight)` | 400 |
| `var(--dt-text-code-lg-font-size)` | 18px |
| `var(--dt-text-code-lg-line-height)` | 1.2 |
| `var(--dt-text-code-md-font-family)` | SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, Courier, monospace |
| `var(--dt-text-code-md-font-weight)` | 400 |
| `var(--dt-text-code-md-font-size)` | 16px |
| `var(--dt-text-code-md-line-height)` | 1.2 |
| `var(--dt-text-code-sm-font-family)` | SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, Courier, monospace |
| `var(--dt-text-code-sm-font-weight)` | 400 |
| `var(--dt-text-code-sm-font-size)` | 14px |
| `var(--dt-text-code-sm-line-height)` | 1.2 |
| `var(--dt-text-code-xs-font-family)` | SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, Courier, monospace |
| `var(--dt-text-code-xs-font-weight)` | 400 |
| `var(--dt-text-code-xs-font-size)` | 12px |
| `var(--dt-text-code-xs-line-height)` | 1.2 |
| `var(--dt-text-code-lg)` | var(--dt-text-code-lg-font-weight) var(--dt-text-code-lg-font-size)/var(--dt-text-code-lg-line-height) var(--dt-text-code-lg-font-family) |
| `var(--dt-text-code-md)` | var(--dt-text-code-md-font-weight) var(--dt-text-code-md-font-size)/var(--dt-text-code-md-line-height) var(--dt-text-code-md-font-family) |
| `var(--dt-text-code-sm)` | var(--dt-text-code-sm-font-weight) var(--dt-text-code-sm-font-size)/var(--dt-text-code-sm-line-height) var(--dt-text-code-sm-font-family) |
| `var(--dt-text-code-xs)` | var(--dt-text-code-xs-font-weight) var(--dt-text-code-xs-font-size)/var(--dt-text-code-xs-line-height) var(--dt-text-code-xs-font-family) |

## Inputs

### Size

| Token | Value |
| --- | --- |
| `var(--dt-inputs-size-border-default)` | 0.15rem |
| `var(--dt-inputs-size-border-status)` | 0.2rem |
| `var(--dt-inputs-size-radius-xs)` | 0.4rem |
| `var(--dt-inputs-size-radius-sm)` | 0.8rem |
| `var(--dt-inputs-size-radius-md)` | 0.8rem |
| `var(--dt-inputs-size-radius-lg)` | 1.2rem |
| `var(--dt-inputs-size-radius-xl)` | 1.6rem |

### LineHeight

| Token | Value |
| --- | --- |
| `var(--dt-inputs-line-height-xs)` | 1.2 |
| `var(--dt-inputs-line-height-sm)` | 1.2 |
| `var(--dt-inputs-line-height-md)` | 1.2 |
| `var(--dt-inputs-line-height-lg)` | 1.2 |
| `var(--dt-inputs-line-height-xl)` | 1.2 |

### Font

| Token | Value |
| --- | --- |
| `var(--dt-inputs-font-size-xs)` | 12px |
| `var(--dt-inputs-font-size-sm)` | 12px |
| `var(--dt-inputs-font-size-md)` | 16px |
| `var(--dt-inputs-font-size-lg)` | 20px |
| `var(--dt-inputs-font-size-xl)` | 28px |
| `var(--dt-inputs-font-weight-xs)` | 400 |
| `var(--dt-inputs-font-weight-sm)` | 400 |
| `var(--dt-inputs-font-weight-md)` | 400 |
| `var(--dt-inputs-font-weight-lg)` | 400 |
| `var(--dt-inputs-font-weight-xl)` | 400 |

### Color

| Token | Value |
| --- | --- |
| `var(--dt-inputs-color-foreground-default)` | #3A3A3A |
| `var(--dt-inputs-color-foreground-placeholder)` | #808080 |
| `var(--dt-inputs-color-foreground-disabled)` | #808080 |
| `var(--dt-inputs-color-border-default)` | hsl(none 0% 10.98% / 0.17) |
| `var(--dt-inputs-color-border-hover)` | hsl(none 0% 10.98% / 0.3) |
| `var(--dt-inputs-color-border-focus)` | #4AA9EA |
| `var(--dt-inputs-color-border-critical)` | #D90A45 |
| `var(--dt-inputs-color-border-success)` | #2EA834 |
| `var(--dt-inputs-color-border-warning)` | #FF9E0E |
| `var(--dt-inputs-color-border-disabled)` | transparent |
| `var(--dt-inputs-color-background-default)` | hsl(none 0% 10.98% / 0.02) |
| `var(--dt-inputs-color-background-focus)` | #F9F9F9 |
| `var(--dt-inputs-color-background-disabled)` | hsl(none 0% 10.98% / 0.1) |

## Action

### Color

| Token | Value |
| --- | --- |
| `var(--dt-action-color-foreground-base-default)` | #7C52FF |
| `var(--dt-action-color-foreground-base-hover)` | #5023DD |
| `var(--dt-action-color-foreground-base-active)` | #5023DD |
| `var(--dt-action-color-foreground-base-primary-default)` | #FFFFFF |
| `var(--dt-action-color-foreground-critical-default)` | #D90A45 |
| `var(--dt-action-color-foreground-critical-hover)` | #AF0032 |
| `var(--dt-action-color-foreground-critical-active)` | #AF0032 |
| `var(--dt-action-color-foreground-critical-primary-default)` | #FFFFFF |
| `var(--dt-action-color-foreground-inverted-default)` | #F9F9F9 |
| `var(--dt-action-color-foreground-inverted-hover)` | #F9F9F9 |
| `var(--dt-action-color-foreground-inverted-active)` | #F9F9F9 |
| `var(--dt-action-color-foreground-inverted-primary-default)` | #7C52FF |
| `var(--dt-action-color-foreground-inverted-primary-hover)` | #5023DD |
| `var(--dt-action-color-foreground-inverted-primary-active)` | #5023DD |
| `var(--dt-action-color-foreground-muted-default)` | #3A3A3A |
| `var(--dt-action-color-foreground-muted-hover)` | #1C1C1C |
| `var(--dt-action-color-foreground-muted-active)` | #1C1C1C |
| `var(--dt-action-color-foreground-disabled-default)` | #808080 |
| `var(--dt-action-color-foreground-positive-default)` | #008E52 |
| `var(--dt-action-color-foreground-positive-hover)` | #004F2E |
| `var(--dt-action-color-foreground-positive-active)` | #004F2E |
| `var(--dt-action-color-foreground-positive-primary-default)` | #FFFFFF |
| `var(--dt-action-color-background-base-default)` | transparent |
| `var(--dt-action-color-background-base-hover)` | hsl(260.6 100% 86.863% / 0.27) |
| `var(--dt-action-color-background-base-active)` | hsl(260.6 100% 77.308% / 0.27) |
| `var(--dt-action-color-background-base-primary-default)` | #7C52FF |
| `var(--dt-action-color-background-base-primary-hover)` | #6538F1 |
| `var(--dt-action-color-background-base-primary-active)` | #5023DD |
| `var(--dt-action-color-background-critical-default)` | transparent |
| `var(--dt-action-color-background-critical-hover)` | hsl(4.6154 100% 82.157% / 0.31) |
| `var(--dt-action-color-background-critical-active)` | hsl(4.6154 100% 73.12% / 0.31) |
| `var(--dt-action-color-background-critical-primary-default)` | #FF1356 |
| `var(--dt-action-color-background-critical-primary-hover)` | #D90A45 |
| `var(--dt-action-color-background-critical-primary-active)` | #AF0032 |
| `var(--dt-action-color-background-inverted-default)` | transparent |
| `var(--dt-action-color-background-inverted-hover)` | hsl(none 0% 100% / 0.23) |
| `var(--dt-action-color-background-inverted-active)` | hsl(none 0% 100% / 0.32) |
| `var(--dt-action-color-background-inverted-primary-default)` | #F9F9F9 |
| `var(--dt-action-color-background-inverted-primary-hover)` | #F5F0FF |
| `var(--dt-action-color-background-inverted-primary-active)` | #D3BCFF |
| `var(--dt-action-color-background-muted-default)` | transparent |
| `var(--dt-action-color-background-muted-hover)` | hsl(none 0% 10.98% / 0.1) |
| `var(--dt-action-color-background-muted-active)` | hsl(none 0% 10.98% / 0.14) |
| `var(--dt-action-color-background-disabled-default)` | hsl(none 0% 10.98% / 0.19) |
| `var(--dt-action-color-background-positive-default)` | transparent |
| `var(--dt-action-color-background-positive-hover)` | hsl(85.116 100% 83.137% / 0.25) |
| `var(--dt-action-color-background-positive-active)` | hsl(85.116 100% 58.196% / 0.25) |
| `var(--dt-action-color-background-positive-primary-default)` | #2EA834 |
| `var(--dt-action-color-background-positive-primary-hover)` | #008E52 |
| `var(--dt-action-color-background-positive-primary-active)` | hsl(154.65 100% 24.78%) |
| `var(--dt-action-color-border-base-default)` | transparent |
| `var(--dt-action-color-border-base-outlined-default)` | #7C52FF |
| `var(--dt-action-color-border-critical-default)` | transparent |
| `var(--dt-action-color-border-critical-outlined-default)` | #D90A45 |
| `var(--dt-action-color-border-inverted-default)` | transparent |
| `var(--dt-action-color-border-inverted-outlined-default)` | hsl(none 0% 100% / 0.2) |
| `var(--dt-action-color-border-muted-default)` | transparent |
| `var(--dt-action-color-border-muted-outlined-default)` | hsl(none 0% 10.98% / 0.17) |
| `var(--dt-action-color-border-positive-default)` | transparent |
| `var(--dt-action-color-border-positive-outlined-default)` | #2EA834 |

## Theme

### Color

| Token | Value |
| --- | --- |
| `var(--dt-theme-color-base)` | #1C1C1C |

### Topbar

| Token | Value |
| --- | --- |
| `var(--dt-theme-topbar-color-foreground)` | hsl(none 0% 10.98% / 0.8) |
| `var(--dt-theme-topbar-color-background)` | #F9F9F9 |
| `var(--dt-theme-topbar-field-color-foreground)` | hsl(none 0% 10.98% / 0.5) |
| `var(--dt-theme-topbar-field-color-foreground-hover)` | hsl(none 0% 10.98% / 0.75) |
| `var(--dt-theme-topbar-field-color-background)` | hsl(none 0% 10.98% / 0.05) |
| `var(--dt-theme-topbar-field-color-background-hover)` | hsl(none 0% 100%) |
| `var(--dt-theme-topbar-field-color-border)` | hsl(none 0% 10.98% / 0) |
| `var(--dt-theme-topbar-field-color-border-hover)` | hsl(none 0% 10.98% / 0.1) |
| `var(--dt-theme-topbar-field-color-border-active)` | hsl(none 0% 10.98% / 0.2) |
| `var(--dt-theme-topbar-button-color-foreground)` | hsl(none 0% 10.98% / 0.65) |
| `var(--dt-theme-topbar-button-color-foreground-hover)` | #1C1C1C |
| `var(--dt-theme-topbar-button-color-background)` | hsl(none 0% 10.98% / 0) |
| `var(--dt-theme-topbar-button-color-background-hover)` | hsl(none 0% 10.98% / 0.05) |
| `var(--dt-theme-topbar-button-color-background-active)` | hsl(none 0% 10.98% / 0.1) |
| `var(--dt-theme-topbar-profile-color-foreground)` | hsl(none 0% 10.98% / 0.8) |
| `var(--dt-theme-topbar-profile-color-foreground-inverted)` | hsl(none 0% 97.647% / 0.75) |
| `var(--dt-theme-topbar-profile-color-background)` | hsl(none 0% 10.98% / 0.05) |
| `var(--dt-theme-topbar-profile-color-background-inverted)` | hsl(none 0% 10.98% / 0.75) |
| `var(--dt-theme-topbar-profile-color-background-hover)` | hsl(none 0% 10.98% / 0.1) |
| `var(--dt-theme-topbar-profile-color-background-active)` | hsl(none 0% 10.98% / 0.14) |

### Sidebar

| Token | Value |
| --- | --- |
| `var(--dt-theme-sidebar-color-foreground)` | #3A3A3A |
| `var(--dt-theme-sidebar-color-foreground-unread)` | #1C1C1C |
| `var(--dt-theme-sidebar-color-background)` | #F9F9F9 |
| `var(--dt-theme-sidebar-icon-color-foreground)` | #3A3A3A |
| `var(--dt-theme-sidebar-status-color-foreground)` | #535353 |
| `var(--dt-theme-sidebar-row-color-background)` | hsl(none 0% 10.98% / 0) |
| `var(--dt-theme-sidebar-row-color-background-hover)` | hsl(none 0% 10.98% / 0.11) |
| `var(--dt-theme-sidebar-row-color-background-active)` | hsl(none 0% 10.98% / 0.15) |
| `var(--dt-theme-sidebar-selected-row-color-foreground)` | #1C1C1C |
| `var(--dt-theme-sidebar-selected-row-color-background)` | hsl(none 0% 10.98% / 0.09) |
| `var(--dt-theme-sidebar-section-color-foreground)` | #535353 |

### Presence

| Token | Value |
| --- | --- |
| `var(--dt-theme-presence-color-background-available)` | #2EA834 |
| `var(--dt-theme-presence-color-background-busy-unavailable)` | #D90A45 |
| `var(--dt-theme-presence-color-background-busy)` | #FF9E0E |
| `var(--dt-theme-presence-color-background-offline)` | #808080 |

### Mention

| Token | Value |
| --- | --- |
| `var(--dt-theme-mention-color-foreground)` | #FFFFFF |
| `var(--dt-theme-mention-color-foreground-strong)` | #F9F9F9 |
| `var(--dt-theme-mention-color-background)` | #7C52FF |
| `var(--dt-theme-mention-color-background-strong)` | #3A1D95 |

## Shell

### Base

| Token | Value |
| --- | --- |
| `var(--dt-shell-base-color-surface)` | #F9F9F9 |
| `var(--dt-shell-base-color-foreground)` | #1C1C1C |
| `var(--dt-shell-base-color-border)` | #1C1C1C |
| `var(--dt-shell-base-color-accent)` | #7C52FF |
| `var(--dt-shell-base-color-action)` | #252525 |
| `var(--dt-shell-base-color-status-positive)` | #008E52 |
| `var(--dt-shell-base-color-status-critical)` | #D90A45 |
| `var(--dt-shell-base-color-status-warning)` | #815008 |
| `var(--dt-shell-base-color-status-away)` | #808080 |
| `var(--dt-shell-base-action-color-background-primary)` | #252525 |
| `var(--dt-shell-base-action-color-background-secondary)` | #252525 |
| `var(--dt-shell-base-action-color-background-muted)` | #252525 |

### Color

| Token | Value |
| --- | --- |
| `var(--dt-shell-color-foreground-primary)` | #1C1C1C |
| `var(--dt-shell-color-foreground-secondary)` | hsl(none 0% 10.98% / 0.86) |
| `var(--dt-shell-color-foreground-tertiary)` | hsl(none 0% 10.98% / 0.72) |
| `var(--dt-shell-color-foreground-strong)` | hsl(none 0% 10.98%) |
| `var(--dt-shell-color-foreground-muted)` | hsl(none 0% 10.98% / 0.6) |
| `var(--dt-shell-color-foreground-disabled)` | hsl(none 0% 10.98% / 0.57) |
| `var(--dt-shell-color-foreground-positive)` | hsl(154.65 100% 23.667%) |
| `var(--dt-shell-color-foreground-critical)` | hsl(342.9 91.189% 35.608%) |
| `var(--dt-shell-color-foreground-warning)` | hsl(35.702 88.321% 20.147%) |
| `var(--dt-shell-color-surface-default)` | #F9F9F9 |
| `var(--dt-shell-color-border-subtle)` | hsl(none 0% 10.98% / 0.1) |
| `var(--dt-shell-color-border-default)` | hsl(none 0% 10.98% / 0.17) |

### Action

| Token | Value |
| --- | --- |
| `var(--dt-shell-action-color-foreground-primary-default)` | hsl(none 0% 10.98% / 0.86) |
| `var(--dt-shell-action-color-foreground-secondary-default)` | hsl(none 0% 10.98% / 0.86) |
| `var(--dt-shell-action-color-foreground-primary-strong)` | hsl(none 0% 10.98%) |
| `var(--dt-shell-action-color-foreground-tertiary-default)` | hsl(none 0% 10.98% / 0.72) |
| `var(--dt-shell-action-color-foreground-primary-disabled)` | hsl(none 0% 10.98% / 0.57) |
| `var(--dt-shell-action-color-foreground-secondary-disabled)` | hsl(none 0% 10.98% / 0.57) |
| `var(--dt-shell-action-color-foreground-muted-default)` | hsl(none 0% 10.98% / 0.6) |
| `var(--dt-shell-action-color-foreground-muted-hover)` | hsl(none 0% 6.588% / 0.6) |
| `var(--dt-shell-action-color-foreground-muted-active)` | hsl(none 0% 6.588% / 0.6) |
| `var(--dt-shell-action-color-foreground-muted-selected)` | hsl(none 0% 4.392% / 0.6) |
| `var(--dt-shell-action-color-background-primary-default)` | hsl(none 0% 14.51% / 0) |
| `var(--dt-shell-action-color-background-primary-hover)` | hsl(none 0% 14.51% / 0.1) |
| `var(--dt-shell-action-color-background-primary-active)` | hsl(none 0% 14.51% / 0.16) |
| `var(--dt-shell-action-color-background-primary-selected)` | hsl(none 0% 14.51% / 0.13) |
| `var(--dt-shell-action-color-background-secondary-default)` | hsl(none 0% 14.51% / 0) |
| `var(--dt-shell-action-color-background-secondary-hover)` | hsl(none 0% 14.51% / 0.1) |
| `var(--dt-shell-action-color-background-secondary-active)` | hsl(none 0% 14.51% / 0.16) |
| `var(--dt-shell-action-color-background-secondary-selected)` | hsl(none 0% 14.51% / 0.13) |
| `var(--dt-shell-action-color-background-muted-default)` | hsl(none 0% 14.51% / 0.05) |
| `var(--dt-shell-action-color-background-muted-hover)` | hsl(none 0% 14.51% / 0.1) |
| `var(--dt-shell-action-color-background-muted-active)` | hsl(none 0% 14.51% / 0.07) |
| `var(--dt-shell-action-color-background-muted-selected)` | hsl(none 0% 14.51% / 0.07) |

### Mention

| Token | Value |
| --- | --- |
| `var(--dt-shell-mention-color-surface-primary)` | #7C52FF |
| `var(--dt-shell-mention-color-surface-secondary)` | hsl(254.57 100% 29.735%) |
| `var(--dt-shell-mention-color-foreground-primary)` | #FFFFFF |
| `var(--dt-shell-mention-color-foreground-secondary)` | #F9F9F9 |

### Logo

| Token | Value |
| --- | --- |
| `var(--dt-shell-logo-color-star)` | #7C52FF |
| `var(--dt-shell-logo-color-wordmark)` | #10022C |

### Presence

| Token | Value |
| --- | --- |
| `var(--dt-shell-presence-color-available)` | #2EA834 |
| `var(--dt-shell-presence-color-unavailable)` | #D90A45 |
| `var(--dt-shell-presence-color-busy)` | #FF9E0E |
| `var(--dt-shell-presence-color-offline)` | #808080 |

## Avatar

### Color

| Token | Value |
| --- | --- |
| `var(--dt-avatar-color-foreground)` | #000000 |
| `var(--dt-avatar-color-background-100)` | #1AA340 |
| `var(--dt-avatar-color-background-200)` | #AAFF83 |
| `var(--dt-avatar-color-background-300)` | #ADEA88 |
| `var(--dt-avatar-color-background-400)` | #77ECA6 |
| `var(--dt-avatar-color-background-500)` | #7AEDBD |
| `var(--dt-avatar-color-background-600)` | #77DEEC |
| `var(--dt-avatar-color-background-700)` | #5ED8FF |
| `var(--dt-avatar-color-background-800)` | #99E7FF |
| `var(--dt-avatar-color-background-900)` | #51A0FE |
| `var(--dt-avatar-color-background-1000)` | #B6CFFF |
| `var(--dt-avatar-color-background-1100)` | #F1B7E8 |
| `var(--dt-avatar-color-background-1200)` | #EC77BD |
| `var(--dt-avatar-color-background-1300)` | #FF67BE |
| `var(--dt-avatar-color-background-1400)` | #F87E7E |
| `var(--dt-avatar-color-background-1500)` | #ECA877 |
| `var(--dt-avatar-color-background-1600)` | #FFBE41 |
| `var(--dt-avatar-color-background-1700)` | #FFD646 |
| `var(--dt-avatar-color-background-1800)` | #F1DAB7 |
| `var(--dt-avatar-color-background-000)` | #E0E0E0 |

## Badge

### Color

| Token | Value |
| --- | --- |
| `var(--dt-badge-color-background-default)` | hsl(none 0% 10.98% / 0.1) |
| `var(--dt-badge-color-background-info)` | #BDE8FF |
| `var(--dt-badge-color-background-success)` | #DBFFA9 |
| `var(--dt-badge-color-background-warning)` | #FFE89C |
| `var(--dt-badge-color-background-critical)` | #FFABA4 |
| `var(--dt-badge-color-background-bulletin)` | #7C52FF |
| `var(--dt-badge-color-background-bulletin-subtle)` | #D3BCFF |
| `var(--dt-badge-color-background-ai)` | linear-gradient(135deg, #471571 0%, #551B84 3.08%, #7C229E 14.48%, #9024A4 23.67%, #B02290 35.5%, #D32B86 48.3%, #E92F6F 60.29%, #F6484F 70.08%, #FB7328 90.02%, #F3960F 97.29%, #F3960F 100%) |
| `var(--dt-badge-color-foreground-default)` | #000000 |
| `var(--dt-badge-color-foreground-bulletin)` | #FFFFFF |
| `var(--dt-badge-color-foreground-bulletin-subtle)` | #3A1D95 |
| `var(--dt-badge-color-foreground-ai)` | #FFFFFF |
| `var(--dt-badge-color-border-default)` | hsl(none 0% 10.98% / 0.11) |
| `var(--dt-badge-color-border-bulletin-subtle)` | hsl(254.57 100% 66.078% / 0.5) |

## Button

### Font

| Token | Value |
| --- | --- |
| `var(--dt-button-font-size-xs)` | 12px |
| `var(--dt-button-font-size-sm)` | 12px |
| `var(--dt-button-font-size-md)` | 16px |
| `var(--dt-button-font-size-lg)` | 20px |
| `var(--dt-button-font-size-xl)` | 28px |
| `var(--dt-button-font-weight-xs)` | 600 |
| `var(--dt-button-font-weight-sm)` | 600 |
| `var(--dt-button-font-weight-md)` | 600 |
| `var(--dt-button-font-weight-lg)` | 500 |
| `var(--dt-button-font-weight-xl)` | 400 |

### LineHeight

| Token | Value |
| --- | --- |
| `var(--dt-button-line-height-xs)` | 1.2 |
| `var(--dt-button-line-height-sm)` | 1.2 |
| `var(--dt-button-line-height-md)` | 1.2 |
| `var(--dt-button-line-height-lg)` | 1.2 |
| `var(--dt-button-line-height-xl)` | 1.2 |

### Size

| Token | Value |
| --- | --- |
| `var(--dt-button-size-radius-xs)` | 0.4rem |
| `var(--dt-button-size-radius-sm)` | 0.8rem |
| `var(--dt-button-size-radius-md)` | 0.8rem |
| `var(--dt-button-size-radius-lg)` | 1.2rem |
| `var(--dt-button-size-radius-xl)` | 1.6rem |

## Checkbox

### Size

| Token | Value |
| --- | --- |
| `var(--dt-checkbox-size-width)` | 1.6rem |
| `var(--dt-checkbox-size-height)` | 1.6rem |
| `var(--dt-checkbox-size-radius)` | 0.4rem |

### Color

| Token | Value |
| --- | --- |
| `var(--dt-checkbox-color-border-unchecked)` | hsl(none 0% 10.98% / 0.3) |
| `var(--dt-checkbox-color-border-unchecked-hover)` | hsl(none 0% 10.98% / 0.5) |
| `var(--dt-checkbox-color-border-checked)` | #7C52FF |
| `var(--dt-checkbox-color-background-checked)` | #7C52FF |
| `var(--dt-checkbox-color-foreground-default)` | transparent |
| `var(--dt-checkbox-color-foreground-checked)` | #F9F9F9 |

## Icon

### Size

| Token | Value |
| --- | --- |
| `var(--dt-icon-size-100)` | 12px |
| `var(--dt-icon-size-200)` | 14px |
| `var(--dt-icon-size-300)` | 18px |
| `var(--dt-icon-size-400)` | 20px |
| `var(--dt-icon-size-500)` | 24px |
| `var(--dt-icon-size-600)` | 32px |
| `var(--dt-icon-size-700)` | 38px |
| `var(--dt-icon-size-800)` | 48px |
| `var(--dt-icon-size-border-100)` | 0.1rem |
| `var(--dt-icon-size-border-200)` | 0.125rem |
| `var(--dt-icon-size-border-300)` | 0.15rem |
| `var(--dt-icon-size-border-400)` | 0.175rem |
| `var(--dt-icon-size-border-500)` | 0.175rem |
| `var(--dt-icon-size-border-600)` | 0.25rem |
| `var(--dt-icon-size-border-700)` | 0.275rem |
| `var(--dt-icon-size-border-800)` | 0.35rem |

## Presence

### Color

| Token | Value |
| --- | --- |
| `var(--dt-presence-color-available)` | #2EA834 |
| `var(--dt-presence-color-unavailable)` | #D90A45 |
| `var(--dt-presence-color-busy)` | #FF9E0E |
| `var(--dt-presence-color-offline)` | #808080 |

## Radio

### Size

| Token | Value |
| --- | --- |
| `var(--dt-radio-size-width)` | 1.6rem |
| `var(--dt-radio-size-height)` | 1.6rem |
| `var(--dt-radio-size-radius)` | 50% |

### Color

| Token | Value |
| --- | --- |
| `var(--dt-radio-color-border-unchecked)` | hsl(none 0% 10.98% / 0.3) |
| `var(--dt-radio-color-border-unchecked-hover)` | hsl(none 0% 10.98% / 0.5) |
| `var(--dt-radio-color-border-checked)` | #7C52FF |
| `var(--dt-radio-color-background-checked)` | #7C52FF |
| `var(--dt-radio-color-foreground-default)` | transparent |
| `var(--dt-radio-color-foreground-checked)` | #F9F9F9 |

## Font

### Size

| Token | Value |
| --- | --- |
| `var(--dt-font-size-100-mobile)` | 1.2rem |
| `var(--dt-font-size-200-mobile)` | 1.6rem |
| `var(--dt-font-size-300-mobile)` | 2rem |
| `var(--dt-font-size-400-mobile)` | 2.9rem |
| `var(--dt-font-size-500-mobile)` | 4.1rem |
| `var(--dt-font-size-100-tc8)` | 1.7rem |
| `var(--dt-font-size-200-tc8)` | 2.1rem |
| `var(--dt-font-size-300-tc8)` | 2.7rem |
| `var(--dt-font-size-400-tc8)` | 3.8rem |
| `var(--dt-font-size-500-tc8)` | 5.4rem |
| `var(--dt-font-size-100-tv)` | 2.5rem |
| `var(--dt-font-size-200-tv)` | 3.2rem |
| `var(--dt-font-size-300-tv)` | 4.1rem |
| `var(--dt-font-size-400-tv)` | 5.8rem |
| `var(--dt-font-size-500-tv)` | 8.2rem |

## Pages

- [For Designers](for-designers.md)
- [For Developers](for-developers.md)
