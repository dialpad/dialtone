import { createLocalVue, mount } from '@vue/test-utils';
import DtSplitButton from './split_button.vue';

/**
 * Auxiliary variables
 * These variables will be used inside tests to help readability and DRY
 * @prefix MOCK_
 * @notation MOCK_[NAME]
 */
const MOCK_EXPECTED_VALUE = true;
// const MOCK_FIELD_NAME = 'mockFieldName';
// const MOCK_FUNCTION = vi.fn();

/**
 * Environment Constants variables
 * Will be always present in every test
 * @prefix base
 * @notation base[NAME]
 */
const baseProps = {};
const baseAttrs = {};
const baseSlots = {};
const baseProvide = {};

/**
 * Environment variables
 * Will be reset after each test
 * @prefix mock
 * @notation mock[NAME]
 */
let mockProps = {};
let mockAttrs = {};
let mockSlots = {};
let mockProvide = {};
let mockListeners = {};

const testContext = {};

describe('DtSplitButton Tests', function () {
  /**
   * Wrappers
   * Will contain the component and all its necessary children
   */
  let wrapper;

  const updateWrapper = () => {
    wrapper = mount(DtSplitButton, {
      propsData: { ...baseProps, ...mockProps },
      attrs: { ...baseAttrs, ...mockAttrs },
      slots: { ...baseSlots, ...mockSlots },
      provide: { ...baseProvide, ...mockProvide },
      listeners: { ...mockListeners },
      localVue: testContext.localVue,
    });
  };

  /**
   * Setup
   * Will prepare the environment for each test
   */
  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });

  beforeEach(() => {
    updateWrapper();
  });

  /**
   * Teardown
   * Will reset the environment after each test
   */
  afterEach(() => {
    mockProps = {};
    mockAttrs = {};
    mockSlots = {};
    mockProvide = {};
    mockListeners = {};
  });

  describe('Presentation Tests', () => {
    /*
     * Test(s) to ensure that the component is correctly rendering
     */
    it('Should render the component', () => {
      expect(wrapper).toBeDefined();
    });
  });

  describe('Accessibility Tests', () => {
    /*
     * Test(s) to ensure that the component is accessible
     */
    it('Bypass empty test suite', () => {
      expect(MOCK_EXPECTED_VALUE).toBeTruthy();
    });
  });

  describe('Interactivity Tests', () => {
    /*
     * Test(s) to ensure that the component correctly handles user input
     */
    it('Bypass empty test suite', () => {
      expect(MOCK_EXPECTED_VALUE).toBeTruthy();
    });
  });

  describe('Validation Tests', () => {
    /*
     * Test(s) to ensure that custom validators are working as expected
     */
    it('Bypass empty test suite', () => {
      expect(MOCK_EXPECTED_VALUE).toBeTruthy();
    });
  });

  describe('Extendability Tests', () => {
    /*
     * Test(s) to ensure that the component can be correctly extended
     */
    it('Bypass empty test suite', () => {
      expect(MOCK_EXPECTED_VALUE).toBeTruthy();
    });
  });
});
