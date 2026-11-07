import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref } from 'vue';
import {
  provideFeatureAwarenessBadgeDefaults,
  useFeatureAwarenessBadge,
} from './useFeatureAwarenessBadge';

function mountComposable (options, provideDefaults) {
  let result;
  const Child = defineComponent({
    name: 'UseFeatureAwarenessBadgeChild',

    setup () {
      result = useFeatureAwarenessBadge(options);
      return () => h('div');
    },
  });

  const Component = defineComponent({
    name: 'UseFeatureAwarenessBadgeTest',

    setup () {
      if (provideDefaults) provideFeatureAwarenessBadgeDefaults(provideDefaults);
      return () => h(Child);
    },
  });

  mount(Component);
  return result;
}

describe('useFeatureAwarenessBadge', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return new stage before release threshold', () => {
    const result = mountComposable({ exposureCount: 0 });

    expect(result.stage.value).toBe('new');
    expect(result.variant.value).toBe('pre-release');
    expect(result.emphasis.value).toBe('strong');
    expect(result.isVisible.value).toBe(true);
  });

  it('should return release stage at release threshold', () => {
    const result = mountComposable({ exposureCount: 3 });

    expect(result.stage.value).toBe('release');
  });

  it('should hide at hidden threshold', () => {
    const result = mountComposable({ exposureCount: 10 });

    expect(result.stage.value).toBe('hidden');
    expect(result.isVisible.value).toBe(false);
  });

  it('should return the release kind', () => {
    expect(mountComposable({ exposureCount: 0 }).kind.value).toBe('release');
  });

  it('should keep the release stage look, not an invalid variant, once hidden', () => {
    const result = mountComposable({ exposureCount: 10 });

    expect(result.variant.value).toBe('release');
    expect(result.emphasis.value).toBe('base');
  });

  it('should keep a custom release stage look once hidden', () => {
    const result = mountComposable({
      exposureCount: 10,
      stages: { release: { variant: 'release', emphasis: 'subtle' } },
    });

    expect(result.variant.value).toBe('release');
    expect(result.emphasis.value).toBe('subtle');
  });

  it('should keep the app-wide variant when a call sets only the emphasis of a stage', () => {
    const result = mountComposable(
      { exposureCount: 10, stages: { release: { emphasis: 'subtle' } } },
      { stages: { release: { variant: 'pre-release', emphasis: 'strong' } } },
    );

    expect(result.variant.value).toBe('pre-release');
    expect(result.emphasis.value).toBe('subtle');
  });

  it('should let a call override a stage field from the app-wide defaults', () => {
    const result = mountComposable(
      { exposureCount: 0, stages: { new: { variant: 'release' } } },
      { stages: { new: { variant: 'pre-release', emphasis: 'base' } } },
    );

    expect(result.variant.value).toBe('release');
    expect(result.emphasis.value).toBe('base');
  });

  it('should accept refs for the thresholds and follow them', async () => {
    const release = ref(5);
    const exposureCount = ref(3);
    const result = mountComposable({ exposureCount, thresholds: { release, hidden: 10 } });

    expect(result.stage.value).toBe('new');
    release.value = 2;
    await nextTick();
    expect(result.stage.value).toBe('release');
  });

  it('should use provided defaults', () => {
    const result = mountComposable(
      { exposureCount: 2 },
      { thresholds: { release: 2, hidden: 4 } },
    );

    expect(result.stage.value).toBe('release');
  });

  it('should react to exposure count changes', async () => {
    const exposureCount = ref(0);
    const result = mountComposable({ exposureCount });

    exposureCount.value = 3;
    await Promise.resolve();

    expect(result.stage.value).toBe('release');
  });

  it('should warn and fall back when thresholds are invalid', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = mountComposable({
      exposureCount: 3,
      thresholds: { release: 10, hidden: 4 },
    });

    expect(result.stage.value).toBe('release');
    expect(warn).toHaveBeenCalled();
  });
});
