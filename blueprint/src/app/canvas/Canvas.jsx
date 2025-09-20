"use client";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { WidgetRenderer } from "./WidgetRenderer";
import styles from "./page.module.css";
import React from "react";

/** Christopher Parsons, 9/18/2025
 * Inputs:
 *  widgets: array
 *  isPlacing: Boolean
 *  isDragging: Boolean
 *  widgetToPlace: Widget
 *  selectedWidgets: array
 *  setSelectedWidgets: function
 *  setIsDragging: function
 *  updateWidget: function
 *  scale: number
 *  setScale: function
 *  setTransformCoords: function
 *  currentPage: Page
 *  canvasRef: JSX Reference
 *  handleCanvasClick: function
 * 
 * Returns the central part of the page. An interface for manipulating the page itself
 * and positioning widgets.
 */
export function Canvas({ widgets, isPlacing, isDragging, widgetToPlace, selectedWidgets, setSelectedWidgets,
    setIsDragging, updateWidget, scale, setScale, setTransformCoords, currentPage, canvasRef, handleCanvasClick }) {

    return (
        /* The wrapper that applies react-zoom-pan-pinch's attributes to the draggable component */
        <TransformWrapper
            initialScale={1}
            initialPositionX={0}
            initialPositionY={0}
            disabled={isPlacing || isDragging}
            limitToBounds={false}
            panning={{ velocityDisabled: true }}
            minScale={0.05}
            // Keep track of zoom transform and scale
            onTransformed={({ state }) => {
            setScale(state.scale);
            setTransformCoords({posX: state.positionX, posY: state.positionY});
            }}
        >
            {/* Canvas area, a window to view the current page */}
            <div className={styles.canvasArea}>

                {/* Contains the draggable component of reach-zoom-pan-pinch */}
                <TransformComponent>

                    {/* The component for moving/zooming the camera */}
                    <div className={styles.canvasView} ref={canvasRef} onClick={handleCanvasClick}>
                        
                        {/* The page itself is its own component here */}
                        <div className={styles.pages}
                        style={{
                            width: currentPage?.width + "px",
                            height: currentPage?.height + "px",
                            backgroundColor: currentPage.backgroundColor,
                        }}
                        >
                        {/* Render new objects, only if widgets exists */}
                        {Array.isArray(widgets) &&
                            widgets.map((widget) => (
                            <WidgetRenderer
                                bounds="parent"
                                key={widget.id}
                                widget={widget}
                                // selectedWidgets? means if selectedWidgets is not null
                                // .some checks if any widgets in the array have the same id
                                isSelected={selectedWidgets?.some((w) => w.id === widget.id)}
                                onClick={() => {
                                // Select the widget when clicked
                                setSelectedWidgets([widget]);
                                console.log("Selected widget: " + widget.id);
                                }}
                                onDragStart={() => setIsDragging(true)}
                                onDragStop={() => setIsDragging(false)}
                                alertDragStop={updateWidget}
                                scale={scale}
                            />
                            ))}

                        {/* If placing a widget, render it at the mouse position */}
                        {isPlacing && widgetToPlace && (
                            <WidgetRenderer key={"placing-" + widgetToPlace.id} widget={widgetToPlace} scale={scale} />
                        )}
                        </div>
                    </div>
                </TransformComponent>
            </div>
        </TransformWrapper>
    );
}