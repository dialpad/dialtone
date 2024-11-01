# System

The core system is primarily driven by the info and options data objects.
Together these provide the required functionality for all the components 
and inner workings of the system through three main components:
* Renderer
* Option bar
* Code panel

## Info
_Immutable_

<details>
<summary>Format</summary>
<pre>
<code>
{
    COMPONENT_FIELD: VALUE,
    MEMBER_GROUP: 
    [
        MEMBER,
        MEMBER,
        ...
    ],
    ...
}
</code>
</pre>
</details>

<details>
<summary>Example</summary>
<pre>
<code>
{
    displayName: 'DtButton',
    description: 'Base Vue component for Dialtone Buttons.',
    attributes: 
    [
        {
            name: 'disabled',
            defaultValue: false,
            initialValue: false,
            defaultType: 'boolean',
            types: 
            [
                'boolean',
            ],
        },
        ...
    ],
    props: 
    [
        {
            name: 'circle',
            description: 'Whether the button is a circle or not.',
            defaultValue: false,
            initialValue: false,
            defaultType: 'boolean',
            types: 
            [
                'boolean',
            ],
            values: 
            [
                true, 
                false,
            ],
        },
        {
            name: 'iconPosition',
            description: 'The position of the icon slot within the button.',
            defaultValue: 'left',
            initialValue: 'left',
            defaultType: 'string',
            types: 
            [
                'string',
            ],
            values: 
            [
                'left', 
                'right',
                'top',
                'bottom',
            ],
        },
        {
            name: 'labelClass',
            description: 'Used to customize the label container',
            defaultValue: '',
            initialValue: '',
            defaultType: 'string',
            types: 
            [
                'string', 
                'array', 
                'object',
            ],
        },
        ...
    ],
    slots:
    [
        {
            name: 'default',
            description: 'Content within button',
        },
        ...
    ],
    events:
    [
        {
            name: 'click',
            description: 'Native button click event',
            types: 
            [
                'pointerevent', 
                'keyboardevent',
            ],
        },
        ...
    ],
}
</code>
</pre>
<i>Info for `dt-button` component</i>
</details>

The **info** data object is a container for all extended component information for the target component.
The raw Dialtone Vue documentation is processed based on the target component and put into a new **info** object.

This object is considered immutable and should not be modified after it is initialized.

The data object is declared in [combinator.vue](/src/components/combinator.vue). 
The main functionality for preprocessing the data is included in [info.js](/src/lib/info.js).

Essential documentation processing actions:
* Rename props with the [model tag](../OVERVIEW.md#model) to original name
* Generate custom members from the [attribute tag](../OVERVIEW.md#attribute)
* Member 'type string' is parsed into an array of type names
* Parse default values
* ...

It is best to put data in **info** when you want to use it in multiple places. For example `defaultType` is added
to **info** for each member based on some validation logic using `defaultType` and `types`. This ensures a
singular, predetermined value is provided to both the option bar and code editor.

Additional data can be added to info in two ways:
* Add custom comments or tags to the Dialtone Vue documentation
* Extend programmatically in [info.js](/src/lib/info.js)

The former method is always preferred if possible, 
however sometimes it may make more sense to modify or extend 'info.js'.
Sometimes it may be best to do both, if the docgen output is not in a preferable format.

## Options
_Reactive_

<details>
<summary>Format</summary>
<pre>
<code>
{
    MEMBER_GROUP: 
    { 
        MEMBER_KEY: VALUE,
    },
}
</code>
</pre>
</details>

<details>
<summary>Example</summary>
<pre>
<code>
{
    attributes: 
    { 
        disabled: false,
        width: '',
    },
    props:
    {
        active: false,
        iconPosition: 'left',
        labelClass: '',
        ...
    },
    slots:
    {
        default: 'dt-button',
        icon: undefined,
    },
}
</code>
</pre>
<i>Options for `dt-button` component with default values</i>
</details>

The **options** data object is the main reactive object that allows interactivity with the target component. It is
essentially a map of member key-value pairs that are used to read and write the state of the target component.

**Options** can be updated by emitting an event with a function parameter that update the members in any way.

Format:
```js
emit(EVENT, options => {
    options[MEMBER_GROUP][MEMBER_KEY] = VALUE;
});
```

Example:
```js
function onInput (e) {
    emit('update:options', options => {
        options.slots[props.name] = e.target.textContent;
    });
}
```
_Code editor update options slot value on input_

After **info** is initialized, the  `initialValue` fields for each member 
are used to set the initial values in **options**. 
