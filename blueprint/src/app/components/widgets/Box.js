import { Widget } from './Widget';

export function Box({ scale, ...props }) {
  
  return (
    <Widget
      {...props}
      style={{
        backgroundColor: props.backgroundColor || '#cccccc',
      }}
      scale={scale}
    />
  );
}