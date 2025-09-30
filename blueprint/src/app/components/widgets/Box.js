import { Widget } from './Widget';

/** Christopher Parsons, 9/18/2025
 * Inputs:
 *  scale: number
 *  ...props: Attributes from Widget
 * 
 * A widget that, when on the screen, appears as a box.
 */
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