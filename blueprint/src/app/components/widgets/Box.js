import { Widget } from './Widget';

export function Box(props) {
  
  return (
    <Widget
      {...props}
      style={{
        backgroundColor: props.backgroundColor || '#ccc',
      }}
    />
  );
}