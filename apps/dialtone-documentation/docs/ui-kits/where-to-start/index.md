---
title: Where to Start
description: Adding a UI Kit component to your project.
keywords: ["ui kits", "getting started", "choose a kit", "adoption", "product design", "implementation"]
---

## 1. Install and add Dialtone

Dialtone is a prerequesite for all UI Kits.See the Dialtone [Getting Started](/guides/getting-started/) guide for instructions on how to install and add Dialtone to your project.

## 2. Choose a Kit

Select the UI kit or kits you want to use. A list of all UI Kits can be found on the [Meet the Kits](/ui-kits/) page. A more full list of components can be found in the [GitHub Repository](https://github.com/dialpad/dialpad-uikits).

```bash
npm install @dialpad/chatkit
# or
npm install @dialpad/formkit
```

## 3. Import and use components

Import the components you need from the kit and use them in your Vue templates:

```js
import "@dialpad/formkit/vue3/css";
import { DtInputTextField } from '@dialpad/formkit/vue3'
```

```js
<DtInputTextField
  :checkbox="checkbox"
  description="Customer inquiries made outside business hours will be sent here"
  :errors="errors"
  :records="records"
  title="Business email for after-hours contacts"
/>
```

## Next Steps

The [UI Kits storybooks](https://uikits.dialpad.com/chatkit) and [GitHub repository](https://github.com/dialpad/dialpad-uikits) have more detailed reference material for each component. If you are interested in adding a new or modifying an existing component within UI Kits, see [How to Contribute](/ui-kits/how-to-contribute/).
