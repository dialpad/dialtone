---
title: Multiline Directive
description: Tests that multi-line VuePress component attributes are stripped.
status: ready
---

## Usage

Here is some content before the directive.

<some-component
  :items="[1, 2, 3]"
  :label="Multi-line attr"
/>

Here is some content after the directive. This text must survive in the output.

<another-component key="value"
  extra="attributes here"
>
  Inner content that should be kept.
</another-component>
