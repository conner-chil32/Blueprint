import { WidgetRenderer } from "./WidgetRenderer";

/**
 * Inputs:
 *  page: Page array
 * 
 * Takes an incoming page and feeds it through the WidgetRenderer, but as a static
 * element with everything turned off.
 */
export default function PageRenderer({ page }) {

    if (!page) return null;

    return (
        <div 
        >
            {/* Render each widget as a static object */}
            {page.widgets?.map((widget) => (
                <WidgetRenderer
                    bounds="parent"
                    staticRender={true}
                    key={widget.id}
                    widget={widget}
                    isSelected={false}
                    onClick={() => {undefined}}
                    onDragStart={undefined}
                    onDragStop={undefined}
                    alertDragStop={undefined}
                    scale={1}
                    changeWidgetProperty={() => {}}
                    style={widget.style}
                />
            ))}
        </div>
    );
}