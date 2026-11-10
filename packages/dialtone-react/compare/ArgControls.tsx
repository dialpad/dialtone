// The comparison's controls: the Vue story's controllable args, as Vue's
// preview reports them. A committed change goes into both frames' URLs, so it
// only offers what a URL can carry.
import { useEffect, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { isUrlSafe } from './frames';
import type { Args, Side } from './frames';

export interface ArgType {
  name?: string;
  control?: false | { type?: string; disable?: boolean };
  options?: unknown[];
  table?: { disable?: boolean };
}

interface ArgControlsProps {
  argTypes: Record<string, ArgType>;
  values: Args;
  overridden: Set<string>;
  /** Changed args a frame didn't apply on its latest load. */
  notApplied: Record<Side, string[]>;
  onChange: (key: string, value: unknown) => void;
  onReset: () => void;
}

const SELECT_TYPES = new Set(['select', 'radio', 'inline-radio']);
const TEXT_TYPES = new Set(['text', 'color']);

const controlType = (argType: ArgType) => {
  const { control } = argType;
  if (!control || control.disable || argType.table?.disable) return null;
  return control.type ?? null;
};

// An `undefined` option arrives as null (see frames.ts); both mean "unset".
const optionLabel = (option: unknown) => option == null ? '(unset)' : String(option);

const UNSAFE_NOTE = 'Can\'t go in a URL (letters, digits, spaces, _ and - only)';

function DraftInput ({ name, type, value, onCommit }: {
  name: string;
  type: 'text' | 'number';
  value: unknown;
  onCommit: (value: unknown) => void;
}) {
  const shown = value == null ? '' : String(value);
  const [draft, setDraft] = useState(shown);
  useEffect(() => setDraft(shown), [shown]);

  const parsed = type === 'number' ? (draft === '' ? undefined : Number(draft)) : draft;
  // The story's own value can be unsafe; only a new value has to travel.
  const safe = draft === shown || isUrlSafe(name, parsed);
  const commit = () => {
    if (draft !== shown && safe) onCommit(parsed);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') commit();
    if (event.key === 'Escape') setDraft(shown);
  };

  return (
    <>
      <input
        className="compare-controls__input"
        type={type}
        value={draft}
        aria-invalid={!safe}
        onChange={event => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={onKeyDown}
      />
      {!safe && (
        <span className="compare-controls__note compare-controls__note--warning">
          {UNSAFE_NOTE}
        </span>
      )}
    </>
  );
}

function Control ({ name, argType, value, onChange }: {
  name: string;
  argType: ArgType;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const type = controlType(argType)!;

  if (type === 'boolean') {
    // Booleans always encode today; checked anyway, like every other value.
    const safe = isUrlSafe(name, value !== true);
    return (
      <>
        <input
          type="checkbox"
          checked={value === true}
          disabled={!safe}
          onChange={event => onChange(event.target.checked)}
        />
        {!safe && <span className="compare-controls__note compare-controls__note--warning">{UNSAFE_NOTE}</span>}
      </>
    );
  }

  if (SELECT_TYPES.has(type) && Array.isArray(argType.options)) {
    const options = argType.options;
    const selected = options.findIndex(option => (option ?? undefined) === value);
    return (
      <select
        className="compare-controls__input"
        value={selected}
        onChange={event => onChange(options[Number(event.target.value)] ?? undefined)}
      >
        {selected === -1 && <option value={-1}>{optionLabel(value)}</option>}
        {options.map((option, i) => {
          // An option a URL can't carry would be dropped without a reload, so
          // it can't be picked (the story's own value can still show).
          const safe = i === selected || isUrlSafe(name, option ?? undefined);
          return (
            <option key={i} value={i} disabled={!safe}>
              {optionLabel(option)}{!safe && ' (can\'t go in a URL)'}
            </option>
          );
        })}
      </select>
    );
  }

  if (type === 'number' || type === 'range') {
    return <DraftInput name={name} type="number" value={value} onCommit={onChange} />;
  }

  if (TEXT_TYPES.has(type)) {
    return <DraftInput name={name} type="text" value={value} onCommit={onChange} />;
  }

  return <span className="compare-controls__note">Not editable here ({type})</span>;
}

const LABELS: Record<Side, string> = { vue: 'Vue', react: 'React' };

export function ArgControls ({ argTypes, values, overridden, notApplied, onChange, onReset }: ArgControlsProps) {
  const names = Object.keys(argTypes).filter(name => controlType(argTypes[name]));
  if (!names.length) return null;

  return (
    <section className="compare-controls" aria-label="Args">
      <header className="compare-controls__header">
        <span>
          Args from the Vue story. A change reloads both frames with the same URL args.
        </span>
        <button type="button" onClick={onReset} disabled={!overridden.size}>Reset</button>
      </header>
      {(['vue', 'react'] as const).filter(side => notApplied[side].length).map(side => (
        <p key={side} className="compare-controls__note compare-controls__note--warning" data-not-applied={side}>
          {LABELS[side]} didn't apply: {notApplied[side].join(', ')}. Its story doesn't declare the arg, can't map the URL value to the arg's type, or ignores it.
        </p>
      ))}
      <div className="compare-controls__grid">
        {names.map(name => (
          <label key={name} className="compare-controls__row">
            <span className={overridden.has(name) ? 'compare-controls__name compare-controls__name--changed' : 'compare-controls__name'}>
              {name}
            </span>
            <span className="compare-controls__value">
              <Control
                name={name}
                argType={argTypes[name]}
                value={values[name]}
                onChange={value => onChange(name, value)}
              />
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}
