import { DtCheckbox } from '../Checkbox';

// Vue creates these once in created(), so they aren't reactive.
const OPTIONS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Other', value: 'other' },
];

/** Decorator used for storybook documentation and unit tests: three checkboxes. */
export function CheckboxesDecorator () {
  return (
    <div>
      {OPTIONS.map(option => (
        <DtCheckbox
          key={option.value}
          value={option.value}
        >
          <span>{option.label}</span>
        </DtCheckbox>
      ))}
    </div>
  );
}
