import { BrowserRouter } from 'react-router-dom';

import type { Preview, Decorator } from '@storybook/react';
import type React from 'react';

const withRouter: Decorator = (Story): React.JSX.Element => (
  <BrowserRouter>
    <div style={{ padding: 20, width: 'fit-content' }}>
      <Story />
    </div>
  </BrowserRouter>
);

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [withRouter],
};

export default preview;
