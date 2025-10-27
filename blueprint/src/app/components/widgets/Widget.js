import { Rnd } from 'react-rnd';
import { useState } from 'react';

/** Christopher Parsons
 * Inputs:
 *  id: number
 *  x: number
 *  y: number
 *  width: number
 *  height: number
 *  isSelected: Boolean
 *  isMoving: Boolean
 *  rotation: number
 *  style: attribute array
 *  onClick: function
 *  alertDragStop: function
 *  children: JSX elements
 *  pointerEventsNone: Boolean
 *  onDragStart: function
 *  onDragStop: function
 *  scale: number
 *  recordState: function
 * 
 * Returns an RND element surrounding a div. Used as a central component in various widgets.
 * The RND element controls movement and rotation. This is used to allow the user to change 
 * the widget's size and position. The div contains all fields needed for React to render 
 * the widget itself.
 */
export function Widget({ staticRender = false, id, x, y, width, height, isSelected, isMoving, rotation, style = {}, onClick, alertDragStop, children, pointerEventsNone, onDragStart, onDragStop, scale, recordState, pageWidth, pageHeight }) {
  const [previousPosition, setPreviousPosition] = useState({ x: 0, y: 0 });
  const handleResize = (e, direction, refToElement, delta, position) => {
    alertDragStop && alertDragStop(id, position.x, position.y, { width: parseInt(refToElement.style.width, 10), height: parseInt(refToElement.style.height, 10) });
  };

  // If rendering static for an HTML page, don't render dynamic components.
  if (!staticRender) {
    return (
      <Rnd
        position={{ x, y }}
        size={{ width: width, height: height }}
        bounds="parent"
        // Update live
        onResize={(e, direction, refToElement, delta, position) => {
          handleResize(e, direction, refToElement, delta, position);
          // Alert the canvas page when resizing starts
          onDragStart && onDragStart(id);
        }}
        onResizeStart={() => {
          // When the user starts resizing, record the page so undo is accurate
          recordState();
        }}
        // Finish resizing
        onResizeStop={(e, direction, refToElement, delta, position) => {
          handleResize(e, direction, refToElement, delta, position);
          // Alert the canvas page when resizing stops
          onDragStop && onDragStop(id);
        }}
        onDragStart={(e, data) => {
          // When drag is started, note the widget's position
          setPreviousPosition({ x: data.x, y: data.y });

          // Alert the canvas page when dragging starts
          onDragStart && onDragStart(id);
        }}
        onDragStop={(e, data) => {
          alertDragStop && alertDragStop(id, data.x, data.y);
          // Alert the canvas page when dragging stops
          onDragStop && onDragStop(id);

          // If the box has not moved within reason, don't update history
          if (Math.abs(data.x - previousPosition.x) > 1 || Math.abs(data.y - previousPosition.y) > 1) {
            recordState();
          }
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
            onClick && onClick(e);
          }}
        >
          {children}
        </div>
      </Rnd>
    );

  } else {
    const fromLeft = (x / pageWidth) * 100;
    const fromTop = (y / pageHeight) * 100;
    const sizeWidth = (width / pageWidth) * 100;
    const sizeHeight = (height / pageHeight) * 100;

    return (
      <div
        key={id}
        style={{
          position: "absolute",
          left: `${fromLeft}%`,
          top: `${fromTop}%`,
          transform: `rotate(${rotation || 0}deg)`,
          width: `${sizeWidth}%`,
          height: `${sizeHeight}%`,
          ...style,
        }}>
          {children}
      </div>
    );
  }
}