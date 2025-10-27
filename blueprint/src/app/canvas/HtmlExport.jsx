import { renderToStaticMarkup } from "react-dom/server";
import { WidgetRenderer } from "./WidgetRenderer";

/** Christopher Parsons 9/26/2025
 * Inputs:
 *  page: Page container
 * Renders an incoming react page into HTML. Uses renderToStaticMarkup
 * to render an outlying page with PageRenderer converting the page to
 * static components.
 */
export default function HTMLExport(page) {
    console.log('Rendering page to HTML:', page);

    if (!page) return "";

    const pageToExport = {
        ...page,
    }

    return '<!doctype html>' + renderToStaticMarkup(
        <html>
            <head>
                <meta charSet="utf-8" />
                <title>{pageToExport.name || "Page"}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"></meta>
                <style>{`
                    html, body {
                        margin: 0;
                        padding: 0;
                        height: 100%;
                    }
                    a {
                        text-decoration: none;
                    }
                `}</style>
            </head>

            <body style={{
                width: "100dvw",
                height: "100dvh",
                display: "grid",
                placeItems: "center",
                backgroundColor: pageToExport.backgroundColor,
            }}>
                <div
                    id="exporting-page"
                    style={{
                        position: "relative",
                        aspectRatio: pageToExport.width / pageToExport.height,
                        width: `min(100vw, calc(100vh * ${pageToExport.width / pageToExport.height}))`,
                        height: "auto",
                    }}>
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        boxSizing: "border-box",
                        transformOrigin: "top left",
                    }}>
                        {/* Render the page */}
                        <div>
                            {/* Render each widget as a static object */}
                            {pageToExport.widgets?.map((widget) => (
                                <WidgetRenderer
                                    bounds="parent"
                                    staticRender={true}
                                    key={widget.id}
                                    widget={widget}
                                    isSelected={false}
                                    onClick={() => { undefined }}
                                    onDragStart={undefined}
                                    onDragStop={undefined}
                                    alertDragStop={undefined}
                                    scale={1}
                                    changeWidgetProperty={() => { }}
                                    style={widget.style}
                                    pageWidth={pageToExport.width}
                                    pageHeight={pageToExport.height}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}