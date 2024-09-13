# Controls

Controls are an interface for manipulating a single value. Their intended use is to provide
interactivity to members in the option bar, however they are built to be modular with reuse in mind.

They have no designation about the option bar or members and simply receive values

## Control Map

The control map provides a directory of controls that can be used by members and the necessary
data required to use them. The control map can be found in [control.js](/src/lib/control.js) 
along with the control utility functions.

Each control map entry must contain a `component` entry that returns the control component

Each control map entry must contain a `default(...)` function that provides a default value which is used by the
option bar when switching control type. It can optionally use an args object to resolve this 
as seen in the 'selection' control.

## Extending

The process of adding a new control can be done in two steps:
1. Create the component in '/src/components/controls/..'
2. Add an entry to the control map in '/src/lib/control.js'
   * Does not need an entry if the control is 'internal' (only used by other controls)

### Implement in Option Bar
A new control may need some additional logic for it to be used in the option bar.

See [OPTION_BAR](OPTION_BAR.md#extending-member-controls)

## Kinds

### Base

Control that is used when no other controls are valid. 
At this point it attempts to convert its value to a string and provide a 'string' control for input.

It can be seen in use for 'func' member types where there is no current control implementation.

### Null

Control that is used to set some nullish values:
* undefined
* null

Sending the raw value `undefined` results in the value prop using its default value (null). The special
symbol `UNSET` is used to represent an intentional `undefined` value.

The parent component has the responsibility to serialize the input value and deserialize the output value
using the utility functions `serializeControlValue(...)` and `deserializeControlValue(...)` respectively.

### Boolean / Number / String

Controls that are used to set their respective data type value.
Consists of an input that can be used to update the value.

The number control can also be used to set the 'NaN' value.

### Array / Object

Controls that are used to provide functionality to manipulate complex objects.

Uses the 'iterable' control to provide a list of values for arrays, and key-values pairs for objects.
Each iterable item has a 'dynamic' control that can be used to set different data type values.

### Slot

Control that is used to set a string representing the slot content of a component.

### Event

Control that is used to display an event of a component.

### Suggestion

Control that is used to set a string value while providing a list of suggested valid values.
A value can be typed or selected with the input. The list indicates the default value.

### Selection

Control that is used to select any value from a list of values. 

### Iterable

Control that is used to provide an interface to modify generic iterable values. 
The important parts of the functionality are abstracted to the parent to allow 
reuse of this control for any iterable value type.

Contains an 'item' slot that will render the slot content for each item from the value array.
This allows the parent to declare input and output functionality for each item.

Example:
```vue
<template #item="{ item, update }">
  <control
    :value="item"
    @update:value="e => update(e)"
  />
</template>
```

Since the value prop is a raw array, a custom `idMap` is used to keep the v-for keys in order.
Any time an item is added or removed, it is mirrored in the `idMap`.

### Dynamic

Control that is used to set a value from a variety of data types.
Contains a 'selection' control to select from a list of types or values.
Selections that are types provide an additional control to set the value.
