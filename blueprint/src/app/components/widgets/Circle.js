import { Widget } from './Widget';

export function Circle({ scale, ...props }) {
  
  return (
    <Widget
      {...props}
      style={{
        borderRadius: "50%", 
        aspectRatio: "1 / 1",
        backgroundColor: props.backgroundColor || '#cccccc',
      }}
      scale={scale}
    />
  );
}