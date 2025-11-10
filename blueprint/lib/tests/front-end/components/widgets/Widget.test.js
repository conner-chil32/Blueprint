import React from 'react';
import { act, render } from '@testing-library/react';
import { Widget } from '@/components/widgets/Widget';
import { Rnd as MockRnd } from 'react-rnd';

jest.mock('react-rnd', () => {
  const React = require('react');

  const MockRnd = ({ children, ...props }) => {
    MockRnd.latestProps = props;
    return (
      <div data-testid="mock-rnd">
        {typeof children === 'function' ? children(props) : children}
      </div>
    );
  };

  MockRnd.latestProps = {};

  return { Rnd: MockRnd };
});

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
  test('respects selection state when configuring react-rnd', () => {
    const { rerender, container } = renderWidget();

    expect(MockRnd.latestProps.disableDragging).toBe(true);
    expect(MockRnd.latestProps.enableResizing).toBe(false);

    rerender(<Widget {...createWidgetProps({ isSelected: true })} />);

    expect(MockRnd.latestProps.disableDragging).toBe(false);
    expect(MockRnd.latestProps.enableResizing).toBeUndefined();

    const widgetShell = container.querySelector('[data-testid="mock-rnd"] > div');
    expect(widgetShell).toHaveStyle({ outline: '2px solid #3b82f6' });
  });

  test('records history only when dragged a meaningful amount', () => {
    const { props } = renderWidget();
    const getHandlers = () => MockRnd.latestProps;

    act(() => {
      getHandlers().onDragStart?.({}, { x: 10, y: 10 });
    });
    act(() => {
      getHandlers().onDragStop?.({}, { x: 11, y: 11 });
    });

    expect(props.recordState).not.toHaveBeenCalled();
    expect(props.alertDragStop).toHaveBeenNthCalledWith(1, props.id, 11, 11);

    act(() => {
      getHandlers().onDragStart?.({}, { x: 11, y: 11 });
    });
    act(() => {
      getHandlers().onDragStop?.({}, { x: 16, y: 11 });
    });

    expect(props.recordState).toHaveBeenCalledTimes(1);
    expect(props.alertDragStop).toHaveBeenNthCalledWith(2, props.id, 16, 11);
  });

  test('reports numeric dimensions during resize lifecycle', () => {
    const { props } = renderWidget({ isSelected: true });
    const { onResizeStart, onResize, onResizeStop } = MockRnd.latestProps;
    const ref = { style: { width: '320px', height: '180px' } };

    act(() => {
      onResizeStart?.();
    });
    expect(props.recordState).toHaveBeenCalledTimes(1);

    act(() => {
      onResize?.({}, 'right', ref, {}, { x: 10, y: 12 });
      onResizeStop?.({}, 'right', ref, {}, { x: 18, y: 24 });
    });

    expect(props.onDragStart).toHaveBeenCalledWith(props.id);
    expect(props.onDragStop).toHaveBeenCalledWith(props.id);
    expect(props.alertDragStop).toHaveBeenNthCalledWith(1, props.id, 10, 12, { width: 320, height: 180 });
    expect(props.alertDragStop).toHaveBeenNthCalledWith(2, props.id, 18, 24, { width: 320, height: 180 });
  });
});
