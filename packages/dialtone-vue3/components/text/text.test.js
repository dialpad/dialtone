import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import DtText from './text.vue';
import {
  TEXT_LINE_CLAMP_CLASS,
  TEXT_NUMERIC_CLASS,
  TEXT_TRUNCATE_CLASS,
  TEXT_KIND_MODIFIERS,
  TEXT_SIZE_MODIFIERS,
  TEXT_STRENGTH_BY_KIND_AND_SIZE,
  TEXT_DENSITY_BY_KIND_AND_SIZE,
  TEXT_WRAP_MODIFIERS,
  TEXT_TRIM_MODIFIERS,
} from './text_constants';
import fs from 'fs';
import path from 'path';

const typeDataPath = path.resolve(__dirname, '../../../../apps/dialtone-documentation/docs/_data/type.json');
const typeData = JSON.parse(fs.readFileSync(typeDataPath, 'utf8'));

describe('DtText', () => {
  const slotContent = 'Sample text';

  const mountComponent = (props = {}, slots = {}) => {
    return mount(DtText, {
      props,
      slots: {
        default: slotContent,
        ...slots,
      },
    });
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the component root', () => {
    const wrapper = mountComponent();

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.classes()).toContain('d-text');
    expect(wrapper.text()).toBe(slotContent);
  });

  it('applies typography modifier class for kind and size', () => {
    const wrapper = mountComponent({ kind: 'headline', size: 'lg' });

    expect(wrapper.classes()).toContain('d-headline--lg');
  });

  it('falls back to default size when invalid size provided', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = mountComponent({ kind: 'headline', size: 'unknown' });

    expect(wrapper.classes()).toContain('d-headline--md');
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('size="unknown"'));
  });

  it('applies truncate class when truncate prop is true', () => {
    const wrapper = mountComponent({ truncate: true });

    expect(wrapper.classes()).toContain(TEXT_TRUNCATE_CLASS);
  });

  it('applies numeric class when numeric prop is true', () => {
    const wrapper = mountComponent({ numeric: true });

    expect(wrapper.classes()).toContain(TEXT_NUMERIC_CLASS);
  });

  it('applies line clamp class and style when maxLines is provided', () => {
    const wrapper = mountComponent({ maxLines: 3 });

    expect(wrapper.classes()).toContain(TEXT_LINE_CLAMP_CLASS);
    expect(wrapper.attributes('style')).toContain('--dt-text-line-clamp: 3');
  });

  it('renders text prop when slot is not provided', () => {
    const wrapper = mount(DtText, {
      props: {
        text: 'Prop driven text',
      },
    });

    expect(wrapper.text()).toBe('Prop driven text');
  });

  it('applies tone modifier class', () => {
    const wrapper = mountComponent({ tone: 'primary' });

    expect(wrapper.classes()).toContain('d-fc-primary');
  });

  it('warns when strength is not supported for the provided kind and size', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = mountComponent({ kind: 'body', size: 'md', strength: 'soft' });

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('strength="soft"'));
    expect(wrapper.classes()).toContain('d-body--md');
    expect(wrapper.classes()).not.toContain('d-body--md-soft');
  });

  it('warns when density is not supported for the provided kind and size', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = mountComponent({ kind: 'helper', size: 'sm', density: 'compact' });

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('density="compact"'));
    expect(wrapper.classes()).toContain('d-helper--sm');
    expect(wrapper.classes()).not.toContain('d-helper--sm-compact');
  });

  it('warns when tone is not recognized', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = mountComponent({ tone: 'not-real' });

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Unsupported tone'));
    expect(wrapper.classes()).not.toContain('d-fc-not-real');
  });

  it('applies align modifier class when align prop is valid', () => {
    const wrapper = mountComponent({ align: 'center' });

    expect(wrapper.classes()).toContain('d-text--align-center');
  });

  it('warns when align is not recognized', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = mountComponent({ align: 'diagonal' });

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Unsupported align "diagonal"'));
    expect(wrapper.classes()).not.toContain('d-text--align-diagonal');
  });

  it('stacks tone, numeric, and maxLines modifiers together', () => {
    const wrapper = mountComponent({ tone: 'success', numeric: true, maxLines: 4 });

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['d-text', 'd-fc-success', TEXT_NUMERIC_CLASS, TEXT_LINE_CLAMP_CLASS]));
    expect(wrapper.attributes('style')).toContain('--dt-text-line-clamp: 4');
  });

  it('removes line clamp class and style when maxLines is cleared', async () => {
    const wrapper = mountComponent({ maxLines: 2 });

    await wrapper.setProps({ maxLines: null });

    expect(wrapper.classes()).not.toContain(TEXT_LINE_CLAMP_CLASS);
    expect(wrapper.attributes('style')).toBeUndefined();
  });

  it('maintains expected classes when mounted onto existing DOM (hydration-style)', () => {
    const mountTarget = document.createElement('div');
    mountTarget.innerHTML = '<span class="d-text"></span>';
    document.body.appendChild(mountTarget);

    const wrapper = mount(DtText, {
      props: { kind: 'headline', size: 'md' },
      slots: { default: slotContent },
      attachTo: mountTarget,
    });

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['d-text', 'd-headline--md']));

    wrapper.unmount();
    mountTarget.remove();
  });

  it('applies wrap modifier class when wrap prop is valid', () => {
    const wrapper = mountComponent({ wrap: 'balance' });

    expect(wrapper.classes()).toContain(TEXT_WRAP_MODIFIERS.balance);
  });

  it('applies all wrap modifier classes correctly', () => {
    Object.entries(TEXT_WRAP_MODIFIERS).forEach(([wrapValue, expectedClass]) => {
      const wrapper = mountComponent({ wrap: wrapValue });
      expect(wrapper.classes()).toContain(expectedClass);
    });
  });

  it('warns when wrap is not recognized', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = mountComponent({ wrap: 'invalid-wrap' });

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Unsupported wrap "invalid-wrap"'));
    expect(wrapper.classes()).not.toContain('d-text--wrap-invalid-wrap');
  });

  it('applies trim modifier class when trim prop is valid', () => {
    const wrapper = mountComponent({ trim: 'both' });

    expect(wrapper.classes()).toContain(TEXT_TRIM_MODIFIERS.both);
  });

  it('applies all trim modifier classes correctly', () => {
    Object.entries(TEXT_TRIM_MODIFIERS).forEach(([trimValue, expectedClass]) => {
      const wrapper = mountComponent({ trim: trimValue });
      expect(wrapper.classes()).toContain(expectedClass);
    });
  });

  it('warns when trim is not recognized', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = mountComponent({ trim: 'invalid-trim' });

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Unsupported trim "invalid-trim"'));
    expect(wrapper.classes()).not.toContain('d-text--trim-invalid-trim');
  });

  it('stacks wrap and trim modifiers with other modifiers', () => {
    const wrapper = mountComponent({
      kind: 'headline',
      size: 'lg',
      wrap: 'balance',
      trim: 'both',
    });

    expect(wrapper.classes()).toEqual(expect.arrayContaining([
      'd-text',
      'd-headline--lg',
      TEXT_WRAP_MODIFIERS.balance,
      TEXT_TRIM_MODIFIERS.both,
    ]));
  });

  it('has data-qa attribute', () => {
    const wrapper = mountComponent();

    expect(wrapper.attributes('data-qa')).toBe('dt-text');
  });

  it('matches documented typography utility classes from type.json', () => {
    const documentedClasses = new Set(typeData.typographyStyles.map(({ var: className }) => className));

    Object.keys(TEXT_KIND_MODIFIERS).forEach((kind) => {
      const sizes = TEXT_SIZE_MODIFIERS[kind] || [];
      const strengthBySize = TEXT_STRENGTH_BY_KIND_AND_SIZE[kind] || {};
      const densityBySize = TEXT_DENSITY_BY_KIND_AND_SIZE[kind] || {};

      sizes.forEach((size) => {
        const baseClass = `d-${kind}--${size}`;
        expect(documentedClasses.has(baseClass)).toBe(true);

        const allowedStrengths = strengthBySize[size] || [];
        const allowedDensities = densityBySize[size] || [];

        allowedStrengths.forEach((strength) => {
          const strengthClass = `${baseClass}-${strength}`;
          expect(documentedClasses.has(strengthClass)).toBe(true);
        });

        allowedDensities.forEach((density) => {
          const densityClass = `${baseClass}-${density}`;
          expect(documentedClasses.has(densityClass)).toBe(true);
        });

        if (allowedStrengths.length && allowedDensities.length) {
          allowedStrengths.forEach((strength) => {
            allowedDensities.forEach((density) => {
              const combinedClass = `${baseClass}-${strength}-${density}`;
              expect(documentedClasses.has(combinedClass)).toBe(true);
            });
          });
        }
      });
    });
  });
});
