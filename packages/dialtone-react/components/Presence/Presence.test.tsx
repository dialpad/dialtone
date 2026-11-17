import { render, screen } from '@testing-library/react';
import { DtPresence, type DtPresenceProps } from './Presence';
import { PRESENCE_STATES } from './PresenceConstants';

const MOCK_SR_TEXT = 'SR Presence Text';

const baseProps: DtPresenceProps = {};
let mockProps: DtPresenceProps = {};

describe('DtPresence Tests', () => {
  let unmount: (() => void) | null = null;
  let rerender: ((ui: React.ReactElement) => void) | null = null;

  // Remounts, as Vue's mount does, rather than rendering a second presence beside the first.
  const updateWrapper = () => {
    unmount?.();
    ({ unmount, rerender } = render(<DtPresence {...baseProps} {...mockProps} />));
  };

  const presence = () => screen.getByTestId('dt-presence');
  const innerPresence = () => screen.getByTestId('dt-presence-inner');

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    unmount = null;
    rerender = null;
  });

  describe('Presentation Tests', () => {
    describe('When presence renders', () => {
      it('should exist', () => {
        expect(presence()).toBeInTheDocument();
      });
    });

    describe('Presence attributes', () => {
      it('should have role=status', () => {
        expect(presence()).toHaveAttribute('role', 'status');
      });

      it('should have aria-live=off by default', () => {
        expect(presence()).toHaveAttribute('aria-live', 'off');
      });

      it('should be able to set aria-live attribute', () => {
        rerender?.(<DtPresence {...baseProps} {...mockProps} aria-live="assertive" />);

        expect(presence()).toHaveAttribute('aria-live', 'assertive');
      });
    });

    describe('SR Text', () => {
      beforeEach(() => {
        mockProps = { srText: MOCK_SR_TEXT };

        updateWrapper();
      });

      it('should correctly render the screen-reader <span/> when an srText prop is passed', () => {
        expect(presence().querySelector('span')).toBeInTheDocument();
      });

      it('should have the `sr-only` class', () => {
        expect(presence().querySelector('span')).toHaveClass('sr-only');
      });

      it('should contain the content of the srText prop', () => {
        expect(presence().querySelector('span')).toHaveTextContent(new RegExp(`^${MOCK_SR_TEXT}$`));
      });
    });

    describe('Presence color when presence is passed through a prop', () => {
      describe('When presence is active', () => {
        it('should have correct color class based on presence', () => {
          rerender?.(<DtPresence presence={PRESENCE_STATES.ACTIVE} />);

          expect(innerPresence()).toHaveClass('d-presence__inner--active');
        });
      });

      describe('When presence is away', () => {
        it('should have correct color class based on presence', () => {
          rerender?.(<DtPresence presence={PRESENCE_STATES.AWAY} />);

          expect(innerPresence()).toHaveClass('d-presence__inner--away');
        });
      });

      describe('When presence is busy', () => {
        it('should have correct color class based on presence', () => {
          rerender?.(<DtPresence presence={PRESENCE_STATES.BUSY} />);

          expect(innerPresence()).toHaveClass('d-presence__inner--busy');
        });
      });

      describe('When presence is offline', () => {
        it('should have correct color class based on presence', () => {
          rerender?.(<DtPresence presence={PRESENCE_STATES.OFFLINE} />);

          expect(innerPresence()).toHaveClass('d-presence__inner--offline');
        });
      });

      describe('When presence is dnd', () => {
        it('should have correct color class based on presence', () => {
          rerender?.(<DtPresence presence={PRESENCE_STATES.DND} />);

          expect(innerPresence()).toHaveClass('d-presence__inner--dnd');
        });
      });
    });

    describe('Presence icon', () => {
      const ICON_QAS = {
        [PRESENCE_STATES.ACTIVE]: 'dt-presence-active-icon',
        [PRESENCE_STATES.AWAY]: 'dt-presence-away-icon',
        [PRESENCE_STATES.BUSY]: 'dt-presence-busy-icon',
        [PRESENCE_STATES.DND]: 'dt-presence-dnd-icon',
      };

      it.each(Object.entries(ICON_QAS))(
        'should render the matching icon when presence is %s',
        (state, qa) => {
          mockProps = { presence: state as DtPresenceProps['presence'] };
          updateWrapper();
          expect(screen.queryByTestId(qa)).toBeInTheDocument();
        },
      );

      it('should not render an icon when presence is offline', () => {
        mockProps = { presence: PRESENCE_STATES.OFFLINE };
        updateWrapper();
        Object.values(ICON_QAS).forEach((qa) => {
          expect(screen.queryByTestId(qa)).not.toBeInTheDocument();
        });
      });

      it('should not render an icon when showIcon is false', () => {
        mockProps = { presence: PRESENCE_STATES.ACTIVE, showIcon: false };
        updateWrapper();
        expect(screen.queryByTestId(ICON_QAS[PRESENCE_STATES.ACTIVE])).not.toBeInTheDocument();
      });
    });
  });
});
