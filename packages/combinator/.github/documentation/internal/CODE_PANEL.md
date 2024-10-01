# Code Panel

The code panel is responsible for providing technical information about the target component in its current state.
It consists of the 'code editor' and 'event console' and also provides an overlay for external components
such as 'settings'.

## Code Editor

The code editor displays the vue template code required to reproduce 
the component in its current state in an external project.

It provides functionality for directly editing slot content for the current component.

### Element

The code editor renders an 'element' component at the root level to represent the target component.
This is the representation of the tag to use in a vue template.

### Attributes

The code editor renders an 'attributes' component inside the 'element' component's opening slot.
This generates all the attribute fields to be included on the element tag.

The members are filtered and determined how they will be displayed based on their value.
Any member with a value matching its default value will be hidden, unless the 'verbose' prop is true.

### Slots

The code editor renders a 'slot' component inside the 'element' component's default slot for each
slot that has content.

The slot is represented by displaying the content wrapped by 'template' tags that match the slot name.
The default slot is not wrapped by 'template' tags.

Slots content is rendered in an editable field that will update **options** data for the slot.

## Event Console

The event console displays data about events captured from the target component. 
It allows exploration of complex objects by storing them in a list and providing an interactive interface.
Each triggered event will create a console entry represented by a 'pair' component.

### Pair

The pair component represents a key-value pair and allows recursive exploration of objects.
A pair contains a name (key) and a value. Based on the data type of the value it will display a 
component to represent a value.

There are a variety of event console components for different value types:
* String
* Value (Boolean, Number, null...)
* Array
* Object
* Function
* Element (HTML Element)

Other components such as objects and array can render more 'pair' components allowing for
 exploration at unlimited depth.

### Lazy Load

The lazy load component provides generic functionality to not render content until the expand button is pressed.
It is used by the 'object', 'array' and 'element' components for two reasons:
* Prevent visual clutter
* Improve performance by preventing over-rendering
