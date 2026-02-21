import React from 'react';
import {
  Title,
  Subtitle,
  Description,
  Primary,
  Controls,
  Stories,
  useOf,
} from '@storybook/addon-docs/blocks';

function DialtoneDocumentationLink() {
  const { preparedMeta } = useOf('meta', ['meta']);
  const segments = preparedMeta.title.split('/');
  const componentName = segments[segments.length - 1];
  const slug = componentName.replace(/\s+/g, '-').toLowerCase();

  return (
    <p>
      <a href={`https://dialtone.dialpad.com/components/${slug}.html`} target="_blank">
        Dialtone documentation ↗
      </a>
    </p>
  );
}

export function DialtoneDocsPage() {
  return (
    <>
      <Title />
      <Subtitle />
      <Description />
      <DialtoneDocumentationLink />
      <Primary />
      <Controls />
      <Stories />
    </>
  );
}
