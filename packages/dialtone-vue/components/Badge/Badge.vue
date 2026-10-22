<template>
  <span
    :class="[
      'd-badge',
      resolvedVariantClass,
      resolvedEmphasisClass,
      resolvedSizeClass,
      BADGE_DECORATION_MODIFIERS[decoration],
      { 'd-badge--subtle': shouldRenderLegacySubtle },
      { 'd-badge--outlined': shouldRenderLegacyOutlined },
    ]"
    data-qa="dt-badge"
  >
    <span
      v-if="decoration"
      class="d-badge__decorative"
    />
    <span
      v-if="hasLeading()"
      :class="['d-badge__leading', leadingClass]"
      data-qa="dt-badge-leading"
    >
      <!-- @slot Optional freeform content at the start of the badge, such as another badge -->
      <slot name="leading" />
    </span>
    <span
      v-if="hasStartIcon()"
      :class="['d-badge__icon-left', startIconClass]"
      data-qa="dt-badge-start-icon"
    >
      <!-- @slot Slot for start icon, icon-size slot prop defaults to '200' -->
      <template v-if="showsMentionPrefix()">{{ MENTION_PREFIX }}</template>
      <slot
        v-else-if="$slots.startIcon"
        name="startIcon"
        :icon-size="iconSize"
      />
      <!-- @slot @deprecated Use startIcon -->
      <slot
        v-else
        name="leftIcon"
        :icon-size="iconSize"
      />
    </span>
    <span :class="['d-badge__label', labelClass]">
      <!-- @slot Slot for badge content, defaults to label prop -->
      <slot>
        {{ resolvedLabel }}
      </slot>
    </span>
    <span
      v-if="hasEndIcon()"
      :class="['d-badge__icon-right', endIconClass]"
      data-qa="dt-badge-end-icon"
    >
      <!-- @slot Slot for end icon, icon-size slot prop defaults to '200' -->
      <slot
        v-if="$slots.endIcon"
        name="endIcon"
        :icon-size="iconSize"
      />
      <!-- @slot @deprecated Use endIcon -->
      <slot
        v-else
        name="rightIcon"
        :icon-size="iconSize"
      />
    </span>
    <span
      v-if="hasTrailing()"
      :class="['d-badge__trailing', trailingClass]"
      data-qa="dt-badge-trailing"
    >
      <!-- @slot Optional freeform content at the end of the badge, such as a nested badge -->
      <slot name="trailing" />
    </span>
  </span>
</template>

<script>
import {
  BADGE_VARIANT_MODIFIERS,
  BADGE_EMPHASIS_MODIFIERS,
  BADGE_SIZE_MODIFIERS,
  BADGE_GROUPS,
  BADGE_DEFAULT_EMPHASIS,
  BADGE_MENTION_PREFIX,
  BADGE_TYPE_MODIFIERS,
  BADGE_TYPE_TO_VARIANT,
  BADGE_DECORATION_MODIFIERS,
} from './BadgeConstants';
import { ICON_SIZE_MODIFIERS } from '@/components/Icon';
import { hasSlotContent } from '@/common/utils/index.js';
import { ordinalSizeValidator } from '@/common/validators';

/**
 * A badge is a compact UI element that provides brief, descriptive information about an element.
 * It is terse, ideally one word.
 * @see https://dialtone.dialpad.com/components/badge.html
 */
export default {
  name: 'DtBadge',

  props: {
    /**
     * The variant of the badge within its group `kind`. Each variant owns its look.
     * Defaults to the default variant of the group (`neutral` for status).
     * - status: neutral, info, positive, warning, critical
     * - counter: count, mention
     * - release: pre-release, release
     * - lifecycle: draft, edited, unsaved, saved, published, archived, scheduled
     * @values neutral, info, positive, warning, critical, count, mention, pre-release, release, draft, edited, unsaved, saved, published, archived, scheduled
     */
    variant: {
      type: String,
      default: undefined,
      validator: (variant) => Object.keys(BADGE_VARIANT_MODIFIERS).includes(variant),
    },

    /**
     * The visual emphasis of the badge.
     * Each group supports its own levels: status, counter and lifecycle support base and strong;
     * release supports subtle (outline), base (light fill) and strong (solid fill) and
     * means how important the feature is. Unsupported levels render the default.
     * Defaults to strong for the release variants and published, otherwise base.
     * @values base, strong, subtle
     */
    emphasis: {
      type: String,
      default: undefined,
      validator: (emphasis) => emphasis === undefined || Object.keys(BADGE_EMPHASIS_MODIFIERS).includes(emphasis),
    },

    /**
     * Text for the badge content. The default slot takes precedence.
     */
    label: {
      type: String,
      default: undefined,
    },

    /**
     * The label typography size of the badge.
     * @values 100, 200, 300, 400, 500
     */
    size: {
      type: [String, Number],
      default: 200,
      validator: (size) => Object.keys(BADGE_SIZE_MODIFIERS).includes(String(size)),
    },

    /**
     * The size of the start and end icons, passed to the icon slots as the icon-size slot prop.
     * @values 100, 200, 300, 400, 500, 600, 700, 800
     */
    iconSize: {
      type: [String, Number],
      default: 200,
      validator: ordinalSizeValidator(ICON_SIZE_MODIFIERS),
    },

    /**
     * Text for the badge content
     * @deprecated Use label instead.
     */
    text: {
      type: String,
      default: undefined,
    },

    /**
     * The group the badge belongs to. It decides which variants and emphasis levels are valid.
     * Defaults to status, so a plain badge is a neutral status badge.
     * @values status, counter, release, lifecycle
     */
    kind: {
      type: String,
      default: 'status',
      validator: (kind) => Object.keys(BADGE_GROUPS).includes(kind),
    },

    /**
     * Color for the badge background
     * @deprecated Use variant instead.
     * @values default, info, positive, warning, critical, bulletin, ai
     */
    type: {
      type: String,
      default: undefined,
      validator: (type) => Object.keys(BADGE_TYPE_MODIFIERS).includes(type),
    },

    /**
     * Decoration for the badge. This can be only used with kind: status and variant: neutral
     * with no icons or leading and trailing content
     * @deprecated Use DtChip variant="default" for categorization.
     * @values default, black-400, black-500, black-900, red-200, red-300, red-400, purple-200,
     * purple-300, purple-400, purple-500, blue-200, blue-300, blue-400, green-300, green-400,
     * green-500, gold-300, gold-400, gold-500, magenta-200, magenta-300, magenta-400
     */
    decoration: {
      type: String,
      default: undefined,
      validator: (type) => Object.keys(BADGE_DECORATION_MODIFIERS).includes(type),
    },

    /**
     * Used to customize the label container
     */
    labelClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Used to customize the leading container
     */
    leadingClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Used to customize the trailing container
     */
    trailingClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Used to customize the start icon container
     */
    startIconClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Used to customize the end icon container
     */
    endIconClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Shows a subtle appearance for the badge
     * Currently only affects the badge when type is bulletin.
     * @deprecated Use emphasis instead.
     */
    subtle: {
      type: Boolean,
      default: null,
    },

    /**
     * Outlines the badge with a border
     * @deprecated Use emphasis instead.
     */
    outlined: {
      type: Boolean,
      default: null,
    },
  },

  data () {
    return {
      BADGE_VARIANT_MODIFIERS,
      BADGE_EMPHASIS_MODIFIERS,
      BADGE_SIZE_MODIFIERS,
      BADGE_TYPE_MODIFIERS,
      BADGE_DECORATION_MODIFIERS,
      MENTION_PREFIX: BADGE_MENTION_PREFIX,
    };
  },

  computed: {
    resolvedVariant () {
      const group = BADGE_GROUPS[this.resolvedKind];
      // A variant that belongs to another group falls back to the group default
      // (validateGroup warns about it). `ai` is a legacy type with no group.
      if (this.variant != null) {
        return group.variants.includes(this.variant) || this.variant === 'ai' ? this.variant : group.defaultVariant;
      }
      // Deprecated alias for the variant.
      if (this.type != null && BADGE_TYPE_TO_VARIANT[this.type]) return BADGE_TYPE_TO_VARIANT[this.type];
      return group.defaultVariant;
    },

    // Falls back to status so an invalid kind still renders; the prop validator reports it.
    resolvedKind () {
      return BADGE_GROUPS[this.kind] ? this.kind : 'status';
    },

    resolvedEmphasis () {
      if (this.emphasis !== undefined && !this.isUnsupportedEmphasis) return this.emphasis;
      return BADGE_DEFAULT_EMPHASIS[this.resolvedVariant] || 'base';
    },

    isUnsupportedEmphasis () {
      return this.emphasis !== undefined && !BADGE_GROUPS[this.resolvedKind].emphasis.includes(this.emphasis);
    },

    resolvedLabel () {
      return this.label ?? this.text ?? '';
    },

    resolvedVariantClass () {
      if (this.resolvedVariant === 'ai') return BADGE_TYPE_MODIFIERS.ai;
      return BADGE_VARIANT_MODIFIERS[this.resolvedVariant];
    },

    resolvedEmphasisClass () {
      return BADGE_EMPHASIS_MODIFIERS[this.resolvedEmphasis];
    },

    resolvedSizeClass () {
      return BADGE_SIZE_MODIFIERS[String(this.size)];
    },

    shouldRenderLegacySubtle () {
      return this.subtle && this.emphasis === undefined;
    },

    shouldRenderLegacyOutlined () {
      return this.outlined && this.emphasis === undefined;
    },
  },

  created () {
    this.validateProps();
  },

  methods: {
    // $slots is not reactive, so slot-dependent values are methods called at render time, not computed.
    // The mention variant shows a text @ before the number unless a start icon replaces it.
    showsMentionPrefix () {
      return this.resolvedVariant === 'mention' &&
        !hasSlotContent(this.$slots.startIcon) &&
        !hasSlotContent(this.$slots.leftIcon);
    },

    hasStartIcon () {
      return hasSlotContent(this.$slots.startIcon) ||
        hasSlotContent(this.$slots.leftIcon) ||
        this.showsMentionPrefix();
    },

    hasEndIcon () {
      return hasSlotContent(this.$slots.endIcon) ||
        hasSlotContent(this.$slots.rightIcon);
    },

    hasLeading () {
      return hasSlotContent(this.$slots.leading);
    },

    hasTrailing () {
      return hasSlotContent(this.$slots.trailing);
    },

    hasContentBesideLabel () {
      return this.hasStartIcon() || this.hasEndIcon() || this.hasLeading() || this.hasTrailing();
    },

    validateProps () {
      if (process.env.NODE_ENV === 'production') return;

      this.warnDeprecatedAliases();
      this.validateTypePropCombination();
      this.validateDecorationPropCombination();
      this.validateEmphasis();
      this.validateGroup();
    },

    validateEmphasis () {
      if (this.isUnsupportedEmphasis) {
        const supported = BADGE_GROUPS[this.resolvedKind].emphasis.join(', ');

        console.warn(
          `DtBadge warning: emphasis="${this.emphasis}" is not supported by the ${this.resolvedKind} group ` +
          `(supports: ${supported}). Rendering emphasis="${this.resolvedEmphasis}".`,
        );
      }
    },

    validateGroup () {
      const group = BADGE_GROUPS[this.kind];

      if (group && this.variant != null && this.variant !== 'ai' && !group.variants.includes(this.variant)) {
        console.warn(
          `DtBadge warning: variant="${this.variant}" does not belong to the ${this.kind} group. ` +
          `Rendering variant="${group.defaultVariant}". Use one of: ${group.variants.join(', ')}.`,
        );
      }
    },

    warnDeprecatedAliases () {
      [
        ['type', 'variant'],
        ['text', 'label'],
        ['subtle', 'emphasis'],
        ['outlined', 'emphasis'],
        ['decoration', 'DtChip variant="default"'],
      ].forEach(([propName, replacement]) => {
        if (this[propName] !== undefined && this[propName] !== null) {
          console.warn(`DtBadge warning: ${propName} is deprecated. Use ${replacement} instead.`);
        }
      });

      [
        ['leftIcon', 'startIcon'],
        ['rightIcon', 'endIcon'],
      ].forEach(([slotName, replacement]) => {
        if (hasSlotContent(this.$slots[slotName])) {
          console.warn(`DtBadge warning: ${slotName} slot is deprecated. Use ${replacement} instead.`);
        }
      });

      if (this.type === 'ai') {
        console.warn('DtBadge warning: type="ai" is deprecated. Use DtChip emphasis="subtle" for AI attribution.');
      }
    },

    validateTypePropCombination () {
      if (this.type !== 'bulletin' && this.subtle && this.emphasis === undefined) {
        console.error('DtBadge error: subtle can only be used with type \'bulletin\'');
      }
    },

    validateDecorationPropCombination () {
      if (!this.decoration) return;

      if (this.kind !== 'status' || this.resolvedVariant !== 'neutral') {
        console.error('DtBadge error: decoration prop can only be used with kind: \'status\' and variant: \'neutral\'.');
      }

      if (this.hasContentBesideLabel()) {
        console.error('DtBadge error: decoration prop cannot be used with icons or leading and trailing content.');
      }
    },
  },
};
</script>
