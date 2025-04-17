import ToastLayoutDefault from './toast_layout_default.vue';

describe('Toast Default Layout Tests', () => {
  describe('Validation Tests', () => {
    describe('Role Validator', () => {
      const MOCK_PROP = ToastLayoutDefault.props.role;

      describe('When provided role is in TOAST_ROLES', () => {
        it('passes custom prop validation', () => {
          expect(MOCK_PROP.validator(MOCK_PROP.default)).toBe(true);
        });
      });

      describe('When provided role is not in TOAST_ROLES', () => {
        it('fails custom prop validation', () => {
          expect(MOCK_PROP.validator(`INVALID_ROLE`)).toBe(false);
        });
      });
    });

    describe('Kind Validator', () => {
      const MOCK_PROP = ToastLayoutDefault.props.kind;

      describe('When provided kind is in NOTICE_KINDS', () => {
        it('passes custom prop validation', () => {
          expect(MOCK_PROP.validator(MOCK_PROP.default)).toBe(true);
        });
      });

      describe('When provided kind is not in NOTICE_KINDS', () => {
        it('fails custom prop validation', () => {
          expect(MOCK_PROP.validator(`INVALID_KIND`)).toBe(false);
        });
      });
    });
  });
});
