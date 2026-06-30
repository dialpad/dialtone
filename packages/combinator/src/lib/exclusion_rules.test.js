import { expect } from 'vitest';
import { shouldExclude, shouldDisable, shouldClear, getDisabledValues } from './exclusion_rules';
import variantsAvatar from '@/src/variants/variants_avatar';
import variantsBadge from '@/src/variants/variants_badge';
import variantsButton from '@/src/variants/variants_button';
import variantsItemLayout from '@/src/variants/variants_item_layout';
import variantsLink from '@/src/variants/variants_link';
import variantsPopover from '@/src/variants/variants_popover';
import variantsSplitButton from '@/src/variants/variants_split_button';
import variantsTabGroup from '@/src/variants/variants_tab_group';
import variantsText from '@/src/variants/variants_text';

const EQUALITY_RULE = { when: { kind: 'body' }, disableValues: { props: { size: ['500'] } } };
const PREDICATE_RULE = { when: { kind: v => v !== 'headline' }, disableValues: { props: { size: ['500'] } } };
const HIDE_RULE = { when: { kind: 'count' }, hide: { props: ['decoration'] } };
const DISABLE_RULE = { when: { kind: 'count' }, disable: { props: ['decoration'] } };
const CLEAR_RULE = { when: { kind: 'outlined' }, clear: { props: ['borderColor'] } };
const SLOT_CLEAR_RULE = { whenSlots: { startIcon: '' }, clear: { props: ['iconSize'] } };

function expectDisabledAndCleared (memberName, exclusionRules, propValues = {}, slotValues = {}) {
  expect(shouldDisable(memberName, 'props', exclusionRules, propValues, slotValues)).toBe(true);
  expect(shouldClear(memberName, 'props', exclusionRules, propValues, slotValues)).toBe(true);
}

function expectEnabled (memberName, exclusionRules, propValues = {}, slotValues = {}) {
  expect(shouldDisable(memberName, 'props', exclusionRules, propValues, slotValues)).toBe(false);
  expect(shouldClear(memberName, 'props', exclusionRules, propValues, slotValues)).toBe(false);
}

describe('exclusion_rules', function () {
  describe('getDisabledValues', function () {
    it('should return empty Set when no rules', function () {
      expect(getDisabledValues('size', [], { kind: 'body' }).size).toBe(0);
    });

    it('should return empty Set when rules is undefined', function () {
      expect(getDisabledValues('size', undefined, { kind: 'body' }).size).toBe(0);
    });

    it('should contain value when equality condition matches', function () {
      expect(getDisabledValues('size', [EQUALITY_RULE], { kind: 'body' }).has('500')).toBe(true);
    });

    it('should return empty Set when equality condition does not match', function () {
      expect(getDisabledValues('size', [EQUALITY_RULE], { kind: 'headline' }).size).toBe(0);
    });

    it('should contain value when predicate condition matches', function () {
      expect(getDisabledValues('size', [PREDICATE_RULE], { kind: 'body' }).has('500')).toBe(true);
    });

    it('should return empty Set when predicate condition does not match', function () {
      expect(getDisabledValues('size', [PREDICATE_RULE], { kind: 'headline' }).size).toBe(0);
    });

    it('should union disabled values across multiple matching rules', function () {
      const rules = [
        { when: { kind: 'body' }, disableValues: { props: { size: ['500'] } } },
        { when: { kind: 'body' }, disableValues: { props: { size: ['600'] } } },
      ];
      expect(getDisabledValues('size', rules, { kind: 'body' }).size).toBe(2);
    });

    it('should coerce numeric values to strings', function () {
      const rules = [
        { when: { kind: 'body' }, disableValues: { props: { size: [500] } } },
      ];
      expect(getDisabledValues('size', rules, { kind: 'body' }).has('500')).toBe(true);
    });

    it('should return empty Set for a prop not in disableValues', function () {
      expect(getDisabledValues('tone', [EQUALITY_RULE], { kind: 'body' }).size).toBe(0);
    });

    it('should ignore rules that only have hide', function () {
      expect(getDisabledValues('decoration', [HIDE_RULE], { kind: 'count' }).size).toBe(0);
    });

  });

  describe('shouldExclude', function () {
    it('should return false when no rules', function () {
      expect(shouldExclude('size', 'props', [], {})).toBe(false);
    });

    it('should return true when condition matches and member is in hide list', function () {
      expect(shouldExclude('decoration', 'props', [HIDE_RULE], { kind: 'count' })).toBe(true);
    });

    it('should return false when condition does not match', function () {
      expect(shouldExclude('decoration', 'props', [HIDE_RULE], { kind: 'label' })).toBe(false);
    });

    it('should return false when member is not in hide list', function () {
      expect(shouldExclude('size', 'props', [HIDE_RULE], { kind: 'count' })).toBe(false);
    });
  });

  describe('shouldDisable', function () {
    it('should return false when no rules', function () {
      expect(shouldDisable('size', 'props', [], {})).toBe(false);
    });

    it('should return true when condition matches and member is in disable list', function () {
      expect(shouldDisable('decoration', 'props', [DISABLE_RULE], { kind: 'count' })).toBe(true);
    });

    it('should treat hide rules as disable rules for backwards compatibility', function () {
      expect(shouldDisable('decoration', 'props', [HIDE_RULE], { kind: 'count' })).toBe(true);
    });

    it('should disable DtBadge icon size when no icon slot is provided', function () {
      expect(shouldDisable('iconSize', 'props', variantsBadge.exclusions, {
        startIcon: '',
        endIcon: '',
      })).toBe(false);
      expect(shouldDisable('iconSize', 'props', variantsBadge.exclusions, {}, {
        startIcon: '',
        endIcon: '',
      })).toBe(true);
      expect(shouldDisable('iconSize', 'props', variantsBadge.exclusions, {}, {
        startIcon: '<dt-icon-lock :size="iconSize" />',
        endIcon: '',
      })).toBe(false);
    });

    it('should disable DtBadge icon class props when their icon slots are empty', function () {
      expect(shouldDisable('startIconClass', 'props', variantsBadge.exclusions, {}, {
        startIcon: '',
        endIcon: '',
      })).toBe(true);
      expect(shouldDisable('endIconClass', 'props', variantsBadge.exclusions, {}, {
        startIcon: '',
        endIcon: '',
      })).toBe(true);
      expect(shouldDisable('startIconClass', 'props', variantsBadge.exclusions, {}, {
        startIcon: '<dt-icon-lock :size="iconSize" />',
        endIcon: '',
      })).toBe(false);
      expect(shouldDisable('endIconClass', 'props', variantsBadge.exclusions, {}, {
        startIcon: '<dt-icon-lock :size="iconSize" />',
        endIcon: '',
      })).toBe(true);
    });
  });

  describe('shouldClear', function () {
    it('should return false when no rules', function () {
      expect(shouldClear('borderColor', 'props', [], {})).toBe(false);
    });

    it('should return true when condition matches and member is in clear list', function () {
      expect(shouldClear('borderColor', 'props', [CLEAR_RULE], { kind: 'outlined' })).toBe(true);
    });

    it('should return false when condition does not match', function () {
      expect(shouldClear('borderColor', 'props', [CLEAR_RULE], { kind: 'default' })).toBe(false);
    });

    it('should evaluate slot conditions before clearing', function () {
      expect(shouldClear('iconSize', 'props', [SLOT_CLEAR_RULE], {}, { startIcon: '' })).toBe(true);
      expect(shouldClear('iconSize', 'props', [SLOT_CLEAR_RULE], {}, {
        startIcon: '<dt-icon-lock :size="iconSize" />',
      })).toBe(false);
    });
  });

  describe('deprecated component prop exclusions', function () {
    it('should keep DtText kind inactive when variant is set', function () {
      expect.hasAssertions();
      expectDisabledAndCleared('kind', variantsText.exclusions, { variant: 'body-md' });
      expectEnabled('kind', variantsText.exclusions, { variant: null });
    });

    it('should keep DtButton link-only deprecated props inactive outside link mode', function () {
      expect.hasAssertions();
      ['underline', 'linkInverted'].forEach(prop => {
        expectDisabledAndCleared(prop, variantsButton.exclusions, { link: false });
        expectEnabled(prop, variantsButton.exclusions, { link: true });
      });
      expectDisabledAndCleared('underline', variantsButton.exclusions, { link: true, linkUnderline: false });
    });

    it('should keep DtButton legacy icon props inactive outside the legacy icon slot path', function () {
      expect.hasAssertions();
      ['iconPosition', 'iconClass'].forEach(prop => {
        expectDisabledAndCleared(prop, variantsButton.exclusions, { link: false }, { icon: '' });
        expectDisabledAndCleared(prop, variantsButton.exclusions, { link: true }, { icon: '<dt-icon />' });
        expectDisabledAndCleared(prop, variantsButton.exclusions, { link: false }, {
          icon: '<dt-icon />',
          startIcon: '<dt-icon />',
        });
        expectEnabled(prop, variantsButton.exclusions, { link: false }, { icon: '<dt-icon />' });
      });
    });

    it('should keep DtAvatar deprecated aliases inactive when replacements are active', function () {
      expect.hasAssertions();
      ['seed', 'family', 'variant'].forEach(prop => {
        expectDisabledAndCleared('color', variantsAvatar.exclusions, { [prop]: prop === 'seed' ? 'user-id' : 1 });
      });
      expectDisabledAndCleared('color', variantsAvatar.exclusions, { iconOnly: true });
      expectDisabledAndCleared('color', variantsAvatar.exclusions, {}, { icon: '<dt-icon />' });
      expectDisabledAndCleared('clickable', variantsAvatar.exclusions, { interactive: true });
      expectEnabled('clickable', variantsAvatar.exclusions, { interactive: false });
    });

    it('should keep simple deprecated aliases inactive when their replacements are active', function () {
      expect.hasAssertions();
      expectDisabledAndCleared('kind', variantsLink.exclusions, { tone: 'critical' });
      expectDisabledAndCleared('externalAnchor', variantsPopover.exclusions, {
        externalAnchorElement: document.createElement('button'),
      });
      expectDisabledAndCleared('tabListClass', variantsTabGroup.exclusions, { tabsClass: 'd-w100p' });
    });

    it('should keep DtItemLayout deprecated class aliases inactive', function () {
      expect.hasAssertions();
      expectDisabledAndCleared('leftClass', variantsItemLayout.exclusions, {}, { start: '', left: '' });
      expectDisabledAndCleared('leftClass', variantsItemLayout.exclusions, { startClass: 'd-px-100' }, {
        start: '<dt-icon />',
      });
      expectEnabled('leftClass', variantsItemLayout.exclusions, {}, { left: '<dt-icon />' });

      expectDisabledAndCleared('bottomClass', variantsItemLayout.exclusions, {}, { blockEnd: '', bottom: '' });
      expectDisabledAndCleared('bottomClass', variantsItemLayout.exclusions, { blockEndClass: 'd-px-100' }, {
        blockEnd: '<dt-badge />',
      });
      expectEnabled('bottomClass', variantsItemLayout.exclusions, {}, { bottom: '<dt-badge />' });

      expectDisabledAndCleared('rightClass', variantsItemLayout.exclusions, {}, { end: '', right: '' });
      expectDisabledAndCleared('rightClass', variantsItemLayout.exclusions, { endClass: 'd-px-100' }, {
        end: '<dt-icon />',
      });
      expectEnabled('rightClass', variantsItemLayout.exclusions, {}, { right: '<dt-icon />' });
    });

    it('should keep DtSplitButton deprecated aliases inactive when replacements are active', function () {
      expect.hasAssertions();
      [
        ['alphaActive', { startActive: true }],
        ['alphaAriaLabel', { startAriaLabel: 'Place call' }],
        ['alphaIconPosition', { startIconPosition: 'right' }],
        ['alphaLeadingClass', { startLeadingClass: 'd-pis-100' }],
        ['alphaTrailingClass', { startTrailingClass: 'd-pie-100' }],
        ['alphaLabelClass', { startLabelClass: 'd-fc-critical' }],
        ['alphaDisabled', { startDisabled: true }],
        ['alphaLoading', { startLoading: true }],
        ['alphaTooltipText', { startTooltipText: 'Place call' }],
        ['omegaActive', { endActive: true }],
        ['omegaAriaLabel', { endAriaLabel: 'More options' }],
        ['omegaDisabled', { endDisabled: true }],
        ['omegaId', { endId: 'more-options' }],
        ['omegaTooltipText', { endTooltipText: 'More options' }],
      ].forEach(([prop, values]) => {
        expectDisabledAndCleared(prop, variantsSplitButton.exclusions, values);
      });
    });

    it('should keep DtSplitButton deprecated aliases inactive outside their slot paths', function () {
      expect.hasAssertions();
      expectDisabledAndCleared('alphaIconPosition', variantsSplitButton.exclusions, {}, {
        startIcon: '',
        alphaIcon: '',
        startEndIcon: '',
      });
      expectDisabledAndCleared('alphaIconPosition', variantsSplitButton.exclusions, {}, {
        startIcon: '<dt-icon />',
        startEndIcon: '<dt-icon />',
      });
      expectEnabled('alphaIconPosition', variantsSplitButton.exclusions, {}, {
        alphaIcon: '<dt-icon />',
        startEndIcon: '',
      });

      ['alphaLeadingClass', 'alphaTrailingClass', 'alphaLabelClass'].forEach(prop => {
        expectDisabledAndCleared(prop, variantsSplitButton.exclusions, {}, {
          default: prop === 'alphaLabelClass' ? '' : 'Label',
          leading: prop === 'alphaLeadingClass' ? '' : '<dt-badge />',
          trailing: prop === 'alphaTrailingClass' ? '' : '<dt-badge />',
        });
      });

      ['omegaActive', 'omegaAriaLabel', 'omegaDisabled', 'omegaId', 'omegaTooltipText'].forEach(prop => {
        expectDisabledAndCleared(prop, variantsSplitButton.exclusions, {}, { end: '<dt-button />' });
        expectDisabledAndCleared(prop, variantsSplitButton.exclusions, {}, { omega: '<dt-button />' });
      });
    });
  });
});
