import { Rnd } from 'react-rnd';
import { useRef } from 'react';

export function Widget({ id, x, y, width, height, isSelected, isMoving, rotation, style = {}, onClick, alertDragStop, children, pointerEventsNone, isDragging=false }) {

  const handleResize = (e, direction, refToElement, delta, position) => {
    alertDragStop && alertDragStop(id, position.x, position.y, {width: parseInt(refToElement.style.width, 10), height: parseInt(refToElement.style.height, 10)});
  };
    
    return (
    <Rnd
      position = {{x, y}}
      size={{ width: width, height: height }}
      bounds="parent"
      onDragStop = {(e, data) => {
        alertDragStop && alertDragStop(id, data.x, data.y)
        isDragging = !isDragging;
      }}
      // Update live
      onResize={(e, direction, refToElement, delta, position) => {
        handleResize(e, direction, refToElement, delta, position);
      }}
      // Finish resizing
      onResizeStop={(e, direction, refToElement, delta, position) => {
        handleResize(e, direction, refToElement, delta, position);
      }}
      onDragStart={(e) => {
          isDragging = !isDragging;
          console.log('isPlacing:', isDragging);
      }}
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