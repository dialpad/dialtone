import { mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
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

  it('should return new stage before lifecycle threshold', () => {
    const result = mountComposable({ exposureCount: 0 });

    expect(result.stage.value).toBe('new');
    expect(result.variant.value).toBe('new');
    expect(result.emphasis.value).toBe('strong');
    expect(result.isVisible.value).toBe(true);
  });

  it('should return lifecycle stage at lifecycle threshold', () => {
    const result = mountComposable({ exposureCount: 3 });

    expect(result.stage.value).toBe('lifecycle');
  });

  it('should hide at hidden threshold', () => {
    const result = mountComposable({ exposureCount: 10 });

    expect(result.stage.value).toBe('hidden');
    expect(result.isVisible.value).toBe(false);
  });

  it('should use provided defaults', () => {
    const result = mountComposable(
      { exposureCount: 2 },
      { thresholds: { new: 0, lifecycle: 2, hidden: 4 } },
    );

    expect(result.stage.value).toBe('lifecycle');
  });

  it('should react to exposure count changes', async () => {
    const exposureCount = ref(0);
    const result = mountComposable({ exposureCount });

    exposureCount.value = 3;
    await Promise.resolve();

    expect(result.stage.value).toBe('lifecycle');
  });

  it('should warn and fall back when thresholds are invalid', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = mountComposable({
      exposureCount: 3,
      thresholds: { new: 0, lifecycle: 10, hidden: 4 },
    });

    expect(result.stage.value).toBe('lifecycle');
    expect(warn).toHaveBeenCalled();
  });
});
