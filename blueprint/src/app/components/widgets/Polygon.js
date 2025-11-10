import { Widget } from './Widget';
import { getShapeVariantStyles } from './shapeStyles';
//Needed to do large rewrites to account for border
export function Polygon({ scale, boxStyle = 'default', ...props }) {
  const {
    width,
    height,
    borderWidth,
    borderColor,
    borderStyle,
    isSelected,
    backgroundColor,
    rotation,
    opacity,
    numSides = 5, // default sides
  } = props;
  const variant = getShapeVariantStyles(boxStyle, props);

  //const strokeColor = isSelected ? 'blue' : (borderColor ?? '#000');
  //const strokeWidth = isSelected ? 2 : (borderWidth ?? 1);
  const strokeColor = (borderColor ?? '#000');
  const strokeWidth = (borderWidth ?? 1);

  const inset = strokeWidth / 2;
  const cx = width / 2;
  const cy = height / 2;
  const r = 0.5 * Math.min(width, height) - inset;

  // Generate N points for a regular polygon
  const pts = [];
  for (let i = 0; i < numSides; i++) {
    const angle = (2 * Math.PI * i) / numSides - Math.PI / 2;
    const px = cx + r * Math.cos(angle);
    const py = cy + r * Math.sin(angle);
    pts.push(`${px},${py}`);
  }
  const points = pts.join(' ');

  // Stroke style (dashed/dotted)
  let strokeDasharray;
  if (!isSelected) {
    if (borderStyle === 'dashed') strokeDasharray = '6,4';
    else if (borderStyle === 'dotted') strokeDasharray = '2,4';
  }

  return (
    <Widget
      {...props}
      scale={scale}
      useOuterBorderFrame={false} // disable Widget’s external border (errant square)
      style={{
        aspectRatio: '1 / 1',
        width,
        height,
        position: 'relative',
        ...variant.wrapper,
      }}
    >
      {/* Polygon clip path independent of selection */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: `polygon(${pts
          .map(p => {
            const [x, y] = p.split(',').map(Number);
            return `${(x / width) * 100}% ${(y / height) * 100}%`;
          })
          .join(',')})`,
          pointerEvents: 'none',
          ...variant.surface,
        }}
        />
      {/* Code for border outline */}
      <svg
        width='100%'
        height='100%'
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio='none'
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          //transform: `rotate(${rotation || 0}deg)`,
          opacity: opacity ?? 1,
          pointerEvents: 'none',
          overflow: 'visible',
        }}
      >
        <polygon
          points={points}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeLinejoin="miter"
        />
      </svg>
    </Widget>
  );
}
