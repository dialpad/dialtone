import type { ComponentPropsWithRef } from 'react';
import { cx } from '../../common/cx';
import { PRESENCE_STATES, type PresenceState } from './PresenceConstants';
import { DtPresenceActiveIcon } from './modules/presence_active_icon';
import { DtPresenceAwayIcon } from './modules/presence_away_icon';
import { DtPresenceBusyIcon } from './modules/presence_busy_icon';
import { DtPresenceDndIcon } from './modules/presence_dnd_icon';

interface DtPresenceOwnProps {
  /**
   * Determines the color of the inner presence circle, indicating status.
   * Accepts one of 5 values: 'busy', 'away', 'active', 'offline', 'dnd'
   * @values busy, away, active, offline, dnd
   */
  presence?: PresenceState;

  /**
   * Since Presence is a visual element, we need SRs to read out any state changes
   * that occur.
   * Text entered here will be read by assistive technology. If null this component will be ignored by AT.
   */
  srText?: string | null;

  /**
   * Renders a state-specific glyph inside the colored circle to reinforce meaning beyond color.
   * Active shows a checkmark; busy and dnd show a minus dash. The `away` and `offline` states do not render a glyph.
   */
  showIcon?: boolean;
}

export type DtPresenceProps = DtPresenceOwnProps & Omit<ComponentPropsWithRef<'div'>, keyof DtPresenceOwnProps>;

function PresenceIcon ({ presence }: { presence: PresenceState }) {
  switch (presence) {
    case PRESENCE_STATES.ACTIVE: return <DtPresenceActiveIcon />;
    case PRESENCE_STATES.AWAY: return <DtPresenceAwayIcon />;
    case PRESENCE_STATES.BUSY: return <DtPresenceBusyIcon />;
    case PRESENCE_STATES.DND: return <DtPresenceDndIcon />;
    default: return null;
  }
}

/**
 * Presence is a user status visual indicator element.
 * @see https://dialtone.dialpad.com/components/presence.html
 */
export function DtPresence ({
  presence = PRESENCE_STATES.ACTIVE,
  srText = null,
  showIcon = true,
  className,
  'aria-live': ariaLive,
  ...rest
}: DtPresenceProps) {
  return (
    <div
      className={cx('d-presence', className)}
      data-qa="dt-presence"
      role="status"
      aria-live={ariaLive || 'off'}
      {...rest}
    >
      {srText && (
        <span data-qa="dt-presence-sr-text" className="sr-only">{srText}{' '}</span>
      )}
      <div
        className={cx('d-presence__inner', {
          'd-presence__inner--active': presence === PRESENCE_STATES.ACTIVE,
          'd-presence__inner--away': presence === PRESENCE_STATES.AWAY,
          'd-presence__inner--busy': presence === PRESENCE_STATES.BUSY,
          'd-presence__inner--offline': presence === PRESENCE_STATES.OFFLINE,
          'd-presence__inner--dnd': presence === PRESENCE_STATES.DND,
        })}
        data-qa="dt-presence-inner"
      >
        {showIcon && presence !== PRESENCE_STATES.OFFLINE && <PresenceIcon presence={presence} />}
      </div>
    </div>
  );
}
