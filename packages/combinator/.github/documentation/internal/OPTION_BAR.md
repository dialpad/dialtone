# Option Bar

The option bar is responsible for providing a user interface to interact and change the state of the target component.

It consists of multiple 'section' components containing 'member group' components 
that generate controls for each member.

The primary task for the option bar is to handle input and output between the 'member group' components
and reflect the state in the **options** object.

### Control Map

See [CONTROL_MAP](CONTROLS.md#control-map)

### Extending Member Controls

The 'member group' component provides the `controlSelector` prop to allow the 'option bar' component to define
what controls are available for each member.

It is important to abstract this functionality to the parent because for certain member groups we want to enforce
a single control (Slots, events). However, for other member groups we want to allow multiple controls based on
member data such a valid types (Props, attributes).

The `controlSelector` prop is a function that provides a parameter for the current member, and expects an array
with the first item as the initial control string, and the second item is an array of string values for all 
the possible controls based on this member as a return value. The string values
represent a key for a control in the 'control map'.

Example:
```vue
<dtc-option-bar-member-group
  :control-selector="getMemberControls"
  ...
/>
```
```js
function getMemberControls (member) {
    return [
        'string',
        [
            'null',
            'string',
            member.specialControlType,
        ]
    ];
}
```
_Example of a member group that will generate a control for 'null', 'string' and 
a variable control for each member based on its `specialControlType` value. The initial
control will be the 'string' control._

## Member Group

The member group receives a group of members and their respective values. It is responsible
for rendering 'option bar control' components for each member. It also renders the 'option bar control selector' 
for each member.

### Member Map

The member map is a reactive data object that wraps each member and can provide additional data that the 
'option bar control' component needs without affecting the original member data object.

It adds an additional `validControls` field that is created based on the `controlSelector` prop. Most importantly,
it adds an additional `control` field to that is the determining value for what control is currently active
for the member.

The `control` field is passed as a prop to the 'option bar control' component and 
updated when the `@update:control` event is emitted from the 'option bar control selector' component.

### Member Values

The `values` prop contains a collection of key-value pairs representing the state of the member.
The member map uses the `getMemberKey(...)` function to match the members to their respective values.

### Control Args

Each member sends a lot of data to the 'option bar control' component through props. Each explicitly defined prop
is used directly by the 'option bar control' except the `args` object prop.

The args prop is an object that contains data to be directly attached to the underlying control using `v-bind`.

## Control Selector

The option bar control selector creates buttons above the control based on the `validControls` prop to allow 
selection of a control from a variety of control selections for a single member.

## Option Bar Control

The option bar control wraps an underlying 'control' component to provide extended functionality
and decouple the reliance on the option bar and members from individual 'control' components.

### Control Component

The option bar control receives a 'control' as a prop and finds the corresponding 'control' component 
in the 'control map'. It renders the component with a dynamic component (`<component />`).

### Extended Args

The `args` prop is used to pass data to bind directly to the underlying control using `v-bind`. 
However, some explicitly declared props on this component are required as well. 
The `controlArgs` computed value introduces some additional values to pass to the control.
