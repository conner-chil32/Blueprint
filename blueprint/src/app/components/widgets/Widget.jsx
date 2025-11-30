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
 *  onDrag: function
 *  onDragStop: function
 *  scale: number
 *  recordState: function
 *  borderWidth: number
 *  borderColor: color
 *  borderStyle: String
 *  useOuterBorderFrame: Boolean
 * 
 * Returns an RND element surrounding a div. Used as a central component in various widgets.
 * The RND element controls movement and rotation. This is used to allow the user to change 
 * the widget's size and position. The div contains all fields needed for React to render 
 * the widget itself.
 */
export function Widget({ staticRender = false, id, x, y, width, height, isSelected, isMoving, rotation, style = {}, onClick, alertDragStop, children, pointerEventsNone,
  onDragStart, onDrag, onDragStop, scale, recordState, pageWidth, pageHeight, opacity, borderWidth, borderColor, borderStyle, useOuterBorderFrame, dragHandleClassName, header,
  onDoubleClick, dragCancelSelector, isEditing }) {
  const [previousPosition, setPreviousPosition] = useState({ x: 0, y: 0 });

  const handleResize = (e, direction, refToElement, delta, position) => {
    alertDragStop &&
      alertDragStop(id, position.x, position.y, {
        width: parseInt(refToElement.style.width, 10),
        height: parseInt(refToElement.style.height, 10),
      });
  };

  if (!staticRender) {
    return (
      <Rnd
        position={{ x, y }}
        size={{ width: width, height: height }}
        bounds="parent"
        enableResizing={isSelected ? undefined : false}
        disableDragging={!isSelected || isEditing}
        dragHandleClassName={dragHandleClassName}
        cancel={dragCancelSelector || undefined}
        // Update live
        onResize={(e, direction, refToElement, delta, position) => {
          handleResize(e, direction, refToElement, delta, position);
          // Alert the canvas page when resizing starts
          onDragStart && onDragStart(id);
        }}
        onResizeStart={() => {
          // When the user starts resizing, record the page so undo is accurate
          setTimeout(() => recordState(), 0);
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
        onDrag={(e, data) => {
          onDrag && onDrag(data.x, data.y);
        }}
        onDragStop={(e, data) => {
          alertDragStop && alertDragStop(id, data.x, data.y);
          // Alert the canvas page when dragging stops
          onDragStop && onDragStop(id);

          // If the box has not moved within reason, don't update history
          if (
            Math.abs(data.x - previousPosition.x) > 1 ||
            Math.abs(data.y - previousPosition.y) > 1
          ) {
            setTimeout(() => recordState(), 0);
          }
        }}
        scale={scale}
      >
        {/* Widget container */}
        <div
          key={id}
          data-testid="widget"
          style={{
            position: 'relative',
            transform: `rotate(${rotation || 0}deg)`,
            transformOrigin: '50% 50%',
            width: width,
            height: height,
            border:
              useOuterBorderFrame === false // user outerborderframe is set to false for non rectangular objects to prevent border rendering errors.
                ? 'none'
                : `${borderWidth ?? 1}px ${borderStyle ?? 'solid'} ${borderColor ?? '#000'}`,
            boxSizing: 'border-box',
            cursor: 'grab',
            isMoving: isMoving,
            pointerEvents: pointerEventsNone ? 'none' : 'auto',
            opacity: opacity !== undefined ? opacity : 1,
            // Selection outline
            ...(isSelected ? { outline: '2px solid #3b82f6', outlineOffset: 0 } : {}),
            ...style,
          }}
          onClick={e => {
            // Prevent click from bubbling up to the canvas
            e.stopPropagation();
            onClick && onClick(e);
          }}
          onDoubleClick={e => {
            e.stopPropagation();
            onDoubleClick && onDoubleClick(e);
          }}
        >
          {header}
          {/* Actual widget */}
          {children}
        </div>
      </Rnd>
    );
  } else {
    const fromLeft = (x / pageWidth) * 100;
    const fromTop = (y / pageHeight) * 100;
    const sizeWidth = (width / pageWidth) * 100;
    const sizeHeight = (height / pageHeight) * 100;

    // Sanitize certain attributes we don't want in the html
    const newStyle = { ...style };
    if ('aspectRatio' in newStyle) {
      delete newStyle.aspectRatio;
    }
    delete newStyle.position;
    delete newStyle.left;
    delete newStyle.top;
    delete newStyle.right;
    delete newStyle.bottom;
    delete newStyle.inset;
    delete newStyle.width;
    delete newStyle.height;
    delete newStyle.maxWidth;
    delete newStyle.maxHeight;
    delete newStyle.minWidth;
    delete newStyle.minHeight;
    delete newStyle.transform;
    delete newStyle.cursor;

    return (
      <div
        key={id}
        style={{
          position: 'absolute',
          left: `${x}px`,
          top: `${y}px`,
          width: `${width}px`,
          height: `${height}px`,
          transform: `rotate(${rotation || 0}deg)`,
          transformOrigin: '50% 50%',
          border:
            useOuterBorderFrame === false // user outerborderframe is set to false for non rectangular objects to prevent border rendering errors.
              ? 'none'
              : `${borderWidth ?? 1}px ${borderStyle ?? 'solid'} ${borderColor ?? '#000'}`,
          boxSizing: 'border-box',
          isMoving: isMoving,
          pointerEvents: pointerEventsNone ? 'none' : 'auto',
          opacity: opacity !== undefined ? opacity : 1,
          ...newStyle,
          cursor: 'default',
        }}
        onClick={e => {
          // Prevent click from bubbling up to the canvas
          e.stopPropagation();
          onClick && onClick(e);
        }}
      >
        {children}
      </div>
    );
  }
}
