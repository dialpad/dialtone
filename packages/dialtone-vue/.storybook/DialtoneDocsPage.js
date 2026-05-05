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

  return React.createElement('p', null,
    React.createElement('a', {
      href: `https://dialtone.dialpad.com/components/${slug}.html`,
      target: '_blank',
      rel: 'noopener noreferrer',
    }, 'Dialtone documentation ↗'),
  );
}

export function DialtoneDocsPage() {
  return React.createElement(React.Fragment, null,
    React.createElement(Title, null),
    React.createElement(Subtitle, null),
    React.createElement(Description, null),
    React.createElement(DialtoneDocumentationLink, null),
    React.createElement(Primary, null),
    React.createElement(Controls, null),
    React.createElement(Stories, null),
  );
}
