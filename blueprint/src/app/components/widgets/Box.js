import { Widget } from './Widget';
import { getShapeVariantStyles } from './shapeStyles';

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
