import { Widget } from './Widget';
//Needed to do large rewrites to account for border

export function Triangle({ scale, ...props }) {
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
  } = props;

  // const strokeColor = isSelected ? 'blue' : (borderColor ?? '#000');
  //const strokeWidth = isSelected ? 2 : (borderWidth ?? 1);
  const strokeColor = (borderColor ?? '#000');
  const strokeWidth = (borderWidth ?? 1);

  let strokeDasharray;
  //if (!isSelected) {
    if (borderStyle === 'dashed') strokeDasharray = '6,4';
    else if (borderStyle === 'dotted') strokeDasharray = '2,4';
  //}

  return (
    <Widget
      {...props}
      scale={scale}
      useOuterBorderFrame={false}
      style={{
        // width,
        // height,
        // position: 'relative',
        backgroundColor: 'transparent', // no box fill
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          //transform: `rotate(${rotation || 0}deg)`,
          opacity: opacity ?? 1,
          pointerEvents: 'none',
        }}
        preserveAspectRatio="none"
      >
        <polygon
          points={`${width / 2},0 0,${height} ${width},${height}`}
          fill={backgroundColor || '#cccccc'}   // triangle fill
          stroke={strokeColor}                  // border color
          strokeWidth={strokeWidth}             // border width
          strokeDasharray={strokeDasharray}
        />
      </svg>
    </Widget>
  );
}
