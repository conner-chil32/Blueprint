import React from 'react';
import { render, screen } from '@testing-library/react';
import { Box } from '@/components/widgets/Box';
import { Circle } from '@/components/widgets/Circle';
import { Polygon } from '@/components/widgets/Polygon';
import { Triangle } from '@/components/widgets/Triangle';
import { Widget as MockWidget } from '@/components/widgets/Widget';
import { getShapeVariantStyles } from '@/components/widgets/shapeStyles';

jest.mock('@/components/widgets/Widget', () => {
  const React = require('react');
  const MockWidget = jest.fn((props) => {
    MockWidget.lastProps = props;
    return <div data-testid="mock-widget">{props.children}</div>;
  });
  MockWidget.lastProps = null;
  return { Widget: MockWidget };
});

jest.mock('@/components/widgets/shapeStyles', () => ({
  getShapeVariantStyles: jest.fn(),
}));

const baseProps = {
  id: 'shape-1',
  x: 0,
  y: 0,
  width: 140,
  height: 90,
  scale: 1,
  backgroundColor: '#123456',
  borderWidth: 2,
  borderColor: '#654321',
  borderStyle: 'solid',
};

const renderShape = (Component, props = {}) =>
  render(<Component {...baseProps} {...props} />);

const getLastWidgetProps = () => {
  const props = MockWidget.lastProps ?? {};
  const { children, ...rest } = props;
  return rest;
};

describe('Widget shape components', () => {
  beforeEach(() => {
    MockWidget.mockClear();
    MockWidget.lastProps = null;
    getShapeVariantStyles.mockReset();
    getShapeVariantStyles.mockReturnValue({
      wrapper: { boxShadow: '0 2px 8px rgba(0,0,0,0.15)' },
      surface: { backgroundColor: '#abcdef', borderRadius: '12px' },
    });
  });

  test('Box merges wrapper and surface styles from presets', () => {
    renderShape(Box, { boxStyle: 'modern', backgroundColor: '#222222' });

    expect(getShapeVariantStyles).toHaveBeenCalledWith(
      'modern',
      expect.objectContaining({ id: 'shape-1', backgroundColor: '#222222' })
    );

    const props = getLastWidgetProps();
    expect(props.style).toMatchObject({
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      backgroundColor: '#abcdef',
      borderRadius: '12px',
    });
  });

  test('Circle enforces round geometry regardless of preset', () => {
    renderShape(Circle, { boxStyle: 'soft' });

    const props = getLastWidgetProps();
    expect(props.style.borderRadius).toBe('50%');
    expect(props.style.aspectRatio).toBe('1 / 1');
  });

  test('Triangle disables the outer border frame and maps dashed borders to the SVG', () => {
    renderShape(Triangle, { borderStyle: 'dashed', borderWidth: 4 });

    const props = getLastWidgetProps();
    expect(props.useOuterBorderFrame).toBe(false);

    const polygon = screen.getByTestId('mock-widget').querySelector('svg polygon');
    expect(polygon).toBeInTheDocument();
    expect(polygon?.getAttribute('stroke-dasharray')).toBe('6,4');
  });

  test('Polygon derives clip paths and dashed borders from props', () => {
    renderShape(Polygon, { borderStyle: 'dotted', numSides: 6, width: 120, height: 120 });

    const props = getLastWidgetProps();
    expect(props.useOuterBorderFrame).toBe(false);
    expect(props.style.aspectRatio).toBe('1 / 1');

    const widget = screen.getByTestId('mock-widget');
    const overlay = widget.querySelector('div');
    expect(overlay?.style.clipPath).toContain('polygon(');

    const polygon = widget.querySelector('svg polygon');
    expect(polygon?.getAttribute('stroke-dasharray')).toBe('2,4');
    const pointCount = polygon?.getAttribute('points')?.trim().split(/\s+/).length ?? 0;
    expect(pointCount).toBe(6);
  });
});
