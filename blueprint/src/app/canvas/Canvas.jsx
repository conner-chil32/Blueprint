"use client";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { WidgetRenderer } from "./WidgetRenderer";
import styles from "./page.module.css";
import { useRef } from "react";

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
export function Canvas({ widgets, recordState, changeWidgetProperty, isDragging, selectedWidgets, setSelectedWidgets,
    setIsDragging, updateWidget, scale, setScale, currentPage, canvasRef, handleCanvasClick, setWidgets }) {
    // Dragging reference
    const dragSnapshot = useRef(null); // { headId, byId: { [id]: {x, y} } }
    const suppressNextClick = useRef(false);

    // When dragging, identify what is being dragged
    const startGroupDrag = (headId) => {
        console.log("Dragging multiple widgets. Head:", headId);

        // Assign selected so we don't ever work with null
        const selected = Array.isArray(selectedWidgets) ? selectedWidgets : [];
        // {} because we want objects, not an array
        const byId = {};

        // Fill byId
        for (const current of selected) {
            byId[current.id] = { x: current.x, y: current.y };
        }

        dragSnapshot.current = { headId, byId };
    }

    /**
     * Move each selected widget alongside the head widget.
     * Don't update history; we want to do that after dragging
     * is done.
     */
    const updateGroupDrag = (headId, headX, headY) => {
        // Positions of everything
        const snap = dragSnapshot.current;
        if (!snap || snap.headId !== headId) return;
        // Starting position of the object being dragged
        const headStartPos = snap.byId[headId];
        if (!headStartPos) return;

        // Calculate deltas of objects' positions
        const dx = headX - headStartPos.x;
        const dy = headY - headStartPos.y;

        // Move them relative to their starting positions
        for (const idW of Object.keys(snap.byId)) {
            const id = Number(idW);
            const start = snap.byId[id];

            changeWidgetProperty(id, {
                x: start.x + dx,
                y: start.y + dy,
            }, true); // Don't push history
        }
    }

    const endGroupDrag = () => {
        dragSnapshot.current = null;
        console.log("Ending group drag.");
    }

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
                    <div className={styles.canvasView} ref={canvasRef}
                        onClick={(e) => {
                            
                            handleCanvasClick();
                        }}
                        >

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
                                        onClick={(e) => {
                                            e.stopPropagation();

                                            // Suppress this selection if the widget was just being moved
                                            if (suppressNextClick.current) {
                                                suppressNextClick.current = false;
                                                return;
                                            }

                                            // Select the widget when clicked. Shift-click to select multiple
                                            if (e.shiftKey) {
                                                setSelectedWidgets(prev => {
                                                    // Ensure array is not null; assign to an empty array if it is
                                                    const originalSelection = Array.isArray(prev) ? prev : [];
                                                    const exists = originalSelection.some(w => w.id === widget.id);

                                                    return exists ? originalSelection.filter(w => w.id !== widget.id) : [...originalSelection, widget];
                                                })
                                            } else {
                                                setSelectedWidgets([widget]);
                                            }
                                            console.log("Selected:", widget.id)
                                        }}
                                        onDragStart={() => {
                                            setIsDragging(true);
                                            if (selectedWidgets.length > 1) {
                                                startGroupDrag(widget.id);
                                            }
                                        }}
                                        onDrag={(x, y) => {
                                            suppressNextClick.current = true;
                                            if (selectedWidgets.length > 1) {
                                                updateGroupDrag(widget.id, x, y);
                                            }
                                        }}
                                        onDragStop={() => {
                                            setIsDragging(false);
                                            if (selectedWidgets.length > 1) {
                                                endGroupDrag();
                                            }
                                            setTimeout(() => {suppressNextClick.current = false}, 0);
                                        }}
                                        alertDragStop={updateWidget}
                                        changeWidgetProperty={changeWidgetProperty}
                                        scale={scale}
                                        recordState={recordState}
                                    />
                                ))}
                        </div>
                    </div>
                </TransformComponent>
            </div>
        </TransformWrapper>
    );
}