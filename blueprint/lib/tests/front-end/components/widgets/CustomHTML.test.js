import React from 'react';
import { render, screen } from '@testing-library/react';
import { CustomHTML } from '@/components/widgets/CustomHTML.jsx';

const baseProps = {
  id: 'custom-1',
  x: 0,
  y: 0,
  width: 320,
  height: 200,
  scale: 1,
};

const renderCustomHTML = (props = {}) =>
  render(<CustomHTML {...baseProps} {...props} />);

describe('CustomHTML widget', () => {
  test('renders iframe content and toggles sandbox attribute', () => {
    const html = '<h1>Hello world</h1>';
    const { container, rerender } = renderCustomHTML({ html, sandbox: true });

    const iframe = container.querySelector('iframe');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('srcdoc', expect.stringContaining(html));
    expect(iframe).toHaveAttribute(
      'sandbox',
      'allow-scripts allow-forms allow-pointer-lock allow-popups'
    );

    rerender(<CustomHTML {...baseProps} html="<p>Updated</p>" sandbox={false} />);

    const updatedIframe = container.querySelector('iframe');
    expect(updatedIframe).not.toHaveAttribute('sandbox');
    expect(updatedIframe).toHaveAttribute('srcdoc', expect.stringContaining('Updated'));
  });

  test('renders with Widget wrapper', () => {
    renderCustomHTML({ html: '<p>Test</p>' });
    const widget = screen.getByTestId('widget');
    expect(widget).toBeInTheDocument();
  });
});
