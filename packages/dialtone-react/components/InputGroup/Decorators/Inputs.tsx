import { InputDecorator } from './Input';

// Vue creates these once in created(), so they aren't reactive.
const OPTIONS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Other', value: 'other' },
];

/** Decorator used for storybook documentation and unit tests: three radio inputs. */
export function InputsDecorator () {
  return (
    <div>
      {OPTIONS.map(option => (
        <InputDecorator
          key={option.value}
          value={option.value}
        >
          <span>{option.label}</span>
        </InputDecorator>
      ))}
    </div>
  );
}
