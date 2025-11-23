import React from 'react';
import { render, screen } from '@testing-library/react';
import { Box } from '@/components/widgets/Box.jsx';
import { Circle } from '@/components/widgets/Circle.jsx';
import { Polygon } from '@/components/widgets/Polygon.jsx';
import { Triangle } from '@/components/widgets/Triangle.jsx';

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

describe('Widget shape components', () => {
  test('Box renders with Widget', () => {
    render(<Box {...baseProps} />);
    const widget = screen.getByTestId('widget');
    expect(widget).toBeInTheDocument();
  });

  test('Circle renders with Widget', () => {
    render(<Circle {...baseProps} />);
    const widget = screen.getByTestId('widget');
    expect(widget).toBeInTheDocument();
  });

  test('Triangle renders with Widget', () => {
    render(<Triangle {...baseProps} />);
    const widget = screen.getByTestId('widget');
    expect(widget).toBeInTheDocument();
  });

  test('Polygon renders with Widget', () => {
    render(<Polygon {...baseProps} numSides={6} />);
    const widget = screen.getByTestId('widget');
    expect(widget).toBeInTheDocument();
  });
});
