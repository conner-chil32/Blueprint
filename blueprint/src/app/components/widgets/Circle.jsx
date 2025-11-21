import { Widget } from '@/components/widgets/Widget.jsx';
import { getShapeVariantStyles } from './shapeStyles.js';

export function Circle({ scale, boxStyle = 'default', ...props }) {
  const variant = getShapeVariantStyles(boxStyle, props);

  return (
    <Widget
      {...props}
      style={{
        borderRadius: "50%", 
        aspectRatio: "1 / 1",
        ...variant.wrapper,
        ...variant.surface,
        borderRadius: '50%',
      }}
      scale={scale}
    />
  );
}
