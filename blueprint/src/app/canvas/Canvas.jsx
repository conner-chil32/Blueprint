"use client";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { WidgetRenderer } from "./WidgetRenderer";
import styles from "./page.module.css";
import React from "react";

/** Christopher Parsons, 9/18/2025
 * Inputs:
 *  widgets: array
 *  isDragging: Boolean
 *  selectedWidgets: array
 *  setSelectedWidgets: function
 *  setIsDragging: function
 *  updateWidget: function
 *  scale: number
 *  setScale: function
 *  currentPage: Page
 *  canvasRef: JSX Reference
 *  handleCanvasClick: function
 * 
 * Returns the central part of the page. An interface for manipulating the page itself
 * and positioning widgets.
 */
export function Canvas({ widgets, changeWidgetProperty, isDragging, selectedWidgets, setSelectedWidgets,
    setIsDragging, updateWidget, scale, setScale, currentPage, canvasRef, handleCanvasClick }) {

    return (
        /* The wrapper that applies react-zoom-pan-pinch's attributes to the draggable component */
        <TransformWrapper
            initialScale={1}
            disabled={isDragging}
            limitToBounds={false}
            panning={{ velocityDisabled: true }}
            minScale={0.05}
            // Keep track of scale
            onTransformed={({ state }) => {
                setScale(state.scale);
            }}
        >
            {/* Canvas area, a window to view the current page */}
            <div className={styles.canvasArea}>

                {/* Contains the draggable component of reach-zoom-pan-pinch */}
                <TransformComponent
                    wrapperStyle={{ width: '100%', height: '100%' }}
                    contentStyle={{ width: '100%', height: '100%' }}>

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
                                        changeWidgetProperty={changeWidgetProperty}
                                        scale={scale}
                                    />
                                ))}
                        </div>
                    </div>
                </TransformComponent>
            </div>
        </TransformWrapper>
    );
}