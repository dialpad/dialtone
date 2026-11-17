import { DtRadio } from '../Radio';

// Vue creates these once in created(), so they aren't reactive.
const OPTIONS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Other', value: 'other' },
];

/** Decorator used for storybook documentation and unit tests: three radios. */
export function RadiosDecorator () {
  return (
    <div>
      {OPTIONS.map(option => (
        <DtRadio
          key={option.value}
          value={option.value}
        >
          <span>{option.label}</span>
        </DtRadio>
      ))}
    </div>
  );
}
