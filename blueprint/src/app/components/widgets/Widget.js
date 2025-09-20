import { Rnd } from 'react-rnd';

/** Christopher Parsons, 9/18/2025
 * Inputs:
 *  id: number
 *  x: number
 *  y: number
 *  width: number
 *  height: number
 *  isSelected: Boolean
 *  isMoving: Boolean
 *  rotation: number
 *  style: CSS attributes
 *  onClick: function
 *  alertDragStop: function
 *  onDragStart: function
 *  onDragStop: function
 *  scale: number
 * 
 * A widget component holding all the information about its own position, movement, and every attribute.
 * A base funciton for other widget types.
 */
export function Widget({ id, x, y, width, height, isSelected, isMoving, rotation, style = {}, onClick, alertDragStop, children, pointerEventsNone, onDragStart, onDragStop, scale }) {

  const handleResize = (e, direction, refToElement, delta, position) => {
    alertDragStop && alertDragStop(id, position.x, position.y, {width: parseInt(refToElement.style.width, 10), height: parseInt(refToElement.style.height, 10)});
  };
    
    return (
    <Rnd
      position = {{x, y}}
      size={{ width: width, height: height }}
      bounds="parent"
      // Update live
      onResize={(e, direction, refToElement, delta, position) => {
        handleResize(e, direction, refToElement, delta, position);
        // Alert the canvas page when resizing starts
        onDragStart && onDragStart(id);
      }}
      // Finish resizing
      onResizeStop={(e, direction, refToElement, delta, position) => {
        handleResize(e, direction, refToElement, delta, position);
        // Alert the canvas page when resizing stops
        onDragStop && onDragStop(id);
      }}
      onDragStart={(e) => {
        // Alert the canvas page when dragging starts
        onDragStart && onDragStart(id);
      }}
      onDragStop = {(e, data) => {
        alertDragStop && alertDragStop(id, data.x, data.y);
        // Alert the canvas page when dragging stops
        onDragStop && onDragStop(id);
      }}
      scale={scale}
      >
        <div
          key={id}
          style={{
            transform: `rotate(${rotation || 0}deg)`,
            width: width,
            height: height,
            border: isSelected ? '2px solid blue' : '1px solid black',
            cursor: 'grab',
            isMoving: isMoving,
            pointerEvents: pointerEventsNone ? 'none' : 'auto',
            ...style,
          }}
        onClick={e => {
          // Prevent click from bubbling up to the canvas
          e.stopPropagation();
          //console.log('Stopping propagation');
          onClick && onClick(e);
        }}
      >
        {children}
      </div>
    </Rnd>
  );
}