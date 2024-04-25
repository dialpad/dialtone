---
title: Dropdown
description: A Dropdown presents a list of options or actions.
status: planned
thumb: true
image: assets/images/components/dropdown.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-dropdown--default
figma_url: https://www.figma.com/file/2adf7JhZOncRyjYiy2joil/DT-Core%3A-Components-7?node-id=10732%3A69099
---

<code-well-header>
<body>
  <dt-dropdown class="d-mr8">
    <template #anchor>
      <dt-button>
        Click to open
      </dt-button>
    </template>
    <template #list>
      <dt-list-item-group
        heading-class="d-py4 d-px8 d-fw-semibold d-c-default"
        heading="Menu Heading A"
      >
        <dt-list-item navigation-type="arrow-keys">
          Menu Item 1
        </dt-list-item>
        <dt-dropdown-separator />
        <dt-list-item navigation-type="arrow-keys">
          Menu Item 2
        </dt-list-item>
      </dt-list-item-group>
      <dt-dropdown-separator />
      <dt-list-item-group
        heading-class="d-py4 d-px8 d-fw-semibold d-c-default"
        heading="Menu Heading B"
      >
        <dt-list-item navigation-type="arrow-keys">
          Menu Item 3
        </dt-list-item>
      </dt-list-item-group>
    </template>
  </dt-dropdown>
</body>
</code-well-header>

<code-example-tabs
htmlCode='
<div>
  <div class="d-popover">
    <div id="DtPopover__anchor2">
      <button class="base-button__button d-btn d-btn--primary">
        <span class="d-btn__label base-button__label"> Click to open </span>
      </button>
    </div>
  </div>
</div>
<div class="tippy-box d-ps-absolute" data-tippy-root="" id="tippy-13" data-popper-placement="bottom" style="...">
  <div id="dt7" role="menu" aria-hidden="false" aria-labelledby="DtPopover__anchor8" aria-modal="false" class="d-popover__dialog d-popover__dialog--modal" tabindex="-1" style="...">
    <div class="d-popover__content">
      <ul id="dt6" class="d-dropdown-list d-py0">
        <ul id="dt16" class="d-list-item-group" role="group" aria-labelledby="dt16-heading">
          <li id="dt16-heading" role="presentation" class="dt-dropdown-list--header d-py4 d-px8 d-fw-semibold d-c-default">Menu Heading A</li>
          <li id="dt17" class="dt-list-item dt-list-item--static" tabindex="-1" role="listitem">
            <div class="dt-item-layout">
              <section class="dt-item-layout--content">
                <div class="dt-item-layout--title">
                  Menu Item 1
                </div>
              </section>
            </div>
          </li>
          <li aria-hidden="true" class="dt-list-separator"></li>
          <li id="dt18" class="dt-list-item dt-list-item--static" tabindex="-1" role="listitem">
            <div class="dt-item-layout">
              <section class="dt-item-layout--content">
                <div class="dt-item-layout--title">
                  Menu Item 2
                </div>
              </section>
            </div>
          </li>
        </ul>
        <li aria-hidden="true" class="dt-list-separator"></li>
        <ul id="dt19" class="d-list-item-group" role="group" aria-labelledby="dt19-heading">
          <li id="dt19-heading" role="presentation" class="dt-dropdown-list--header d-py4 d-px8 d-fw-semibold d-c-default">Menu Heading B</li>
          <li id="dt20" class="dt-list-item dt-list-item--static" tabindex="-1" role="listitem">
            <div class="dt-item-layout">
              <section class="dt-item-layout--content">
                <div class="dt-item-layout--title">
                  Menu Item 3
                </div>
              </section>
            </div>
          </li>
        </ul>
      </ul>
    </div>
  </div>
</div>
'
vueCode='
<dt-dropdown class="d-mr8">
  <template #anchor>
    <dt-button>
      with sections and headings
    </dt-button>
  </template>
  <template #list>
    <dt-list-item-group
      heading-class="d-py4 d-px8 d-fw-semibold d-c-default"
      heading="Menu Heading A"
    > 
      <dt-list-item navigation-type="arrow-keys">
        Menu Item 1
      </dt-list-item>
      <dt-dropdown-separator />
      <dt-list-item navigation-type="arrow-keys">
        Menu Item 2
      </dt-list-item>
    </dt-list-item-group>
    <dt-dropdown-separator />
    <dt-list-item-group
      heading-class="d-py4 d-px8 d-fw-semibold d-c-default"
      heading="Menu Heading B"
    >
      <dt-list-item navigation-type="arrow-keys">
        Menu Item 3
      </dt-list-item>
    </dt-list-item-group>
  </template>
</dt-dropdown>
'
showHtmlWarning />

## Vue API

<component-vue-api component-name="dropdown" />
