import { Widget } from './Widget';

export function Triangle({ scale, ...props }) {
  
  return (
    <Widget
      {...props}
      style={{
        clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
        aspectRatio: "1 / 1",
        backgroundColor: props.backgroundColor || '#cccccc',
      }}
      scale={scale}
    />
  );
}