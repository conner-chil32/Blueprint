import { Widget } from '@/components/widgets/Widget.jsx';
import { getShapeVariantStyles } from './shapeStyles.js';

export function Box({ scale, boxStyle = 'default', ...props }) {
  
  const variant = getShapeVariantStyles(boxStyle, props);
  return (
    <Widget
      {...props}
      style={{
        ...variant.wrapper,
        ...variant.surface,
      }}
      scale={scale}
    />
  );
}
