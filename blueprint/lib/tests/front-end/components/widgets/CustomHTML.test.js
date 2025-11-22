import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import { CustomHTML } from '@/components/widgets/CustomHTML';
import { Widget as MockWidget } from '@/components/widgets/Widget';

jest.mock('@/components/widgets/Widget', () => {
  const React = require('react');
  const MockWidget = jest.fn((props) => {
    MockWidget.lastProps = props;
    return (
      <div data-testid="mock-widget">
        {props.header}
        {props.children}
      </div>
    );
  });
  MockWidget.lastProps = null;
  return { Widget: MockWidget };
});

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

afterEach(() => {
  jest.useRealTimers();
  MockWidget.mockClear();
  MockWidget.lastProps = null;
});

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

  test('shows the drag handle when selected or hovered and forwards widget props', () => {
    jest.useFakeTimers();
    const { container, rerender } = renderCustomHTML({ isSelected: false });

    const handle = container.querySelector('.widget-drag-handle');
    expect(handle).toBeInTheDocument();
    expect(handle).toHaveStyle({ opacity: '0' });

    fireEvent.mouseEnter(handle);
    expect(handle).toHaveStyle({ opacity: '1' });

    fireEvent.mouseLeave(handle);
    act(() => {
      jest.advanceTimersByTime(800);
    });
    expect(handle).toHaveStyle({ opacity: '0' });

    rerender(<CustomHTML {...baseProps} isSelected />);
    const updatedHandle = container.querySelector('.widget-drag-handle');
    expect(updatedHandle).toHaveStyle({ opacity: '1' });

    const { children, ...widgetProps } = MockWidget.lastProps ?? {};
    expect(widgetProps.useOuterBorderFrame).toBe(false);
    expect(widgetProps.dragHandleClassName).toBe('widget-drag-handle');
  });
});
