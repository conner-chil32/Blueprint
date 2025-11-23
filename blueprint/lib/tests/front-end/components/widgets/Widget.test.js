import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { Widget } from '@/components/widgets/Widget.jsx';
import { Rnd } from 'react-rnd';

const createWidgetProps = (overrides = {}) => ({
  id: 'widget-1',
  x: 10,
  y: 20,
  width: 240,
  height: 120,
  rotation: 0,
  isSelected: false,
  isMoving: false,
  pointerEventsNone: false,
  style: {},
  scale: 1,
  opacity: 1,
  borderWidth: 1,
  borderColor: '#000',
  borderStyle: 'solid',
  alertDragStop: jest.fn(),
  onDragStart: jest.fn(),
  onDrag: jest.fn(),
  onDragStop: jest.fn(),
  recordState: jest.fn(),
  ...overrides,
});

const renderWidget = (overrides = {}) => {
  const { children, ...rest } = overrides;
  const props = createWidgetProps(rest);
  const content = children ?? <div>content</div>;
  const utils = render(<Widget {...props}>{content}</Widget>);
  return { ...utils, props };
};

describe('Widget', () => {
  test('renders widget content correctly', () => {
    const { container } = renderWidget();
    const widget = container.querySelector('[data-testid="widget"]');
    expect(widget).toBeInTheDocument();
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  test('applies selection outline when isSelected is true', () => {
    const { container } = renderWidget({ isSelected: true });
    const widget = container.querySelector('[data-testid="widget"]');
    expect(widget).toHaveStyle({ outline: '2px solid #3b82f6' });
  });

  test('does not apply selection outline when isSelected is false', () => {
    const { container } = renderWidget({ isSelected: false });
    const widget = container.querySelector('[data-testid="widget"]');
    expect(widget).not.toHaveStyle({ outline: '2px solid #3b82f6' });
  });
});
