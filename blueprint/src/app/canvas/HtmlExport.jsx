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

    return renderToStaticMarkup(
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
                    #exporting-page {
                        position: relative;
                    }
                    a {
                        text-decoration: none;
                    }
                `}</style>
            </head>

            <body style={{
                width: "100dvw",
                height: "100dvh",
                backgroundColor: pageToExport.backgroundColor,
                position: "relative",
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "0",
            }}>
                <div
                    id="exporting-page"
                    style={{
                        position: "relative",
                        width: pageToExport.width + "px",
                        height: pageToExport.height + "px",
                    }}>
                    {/* Render the page */}
                    <div>
                        {/* Render each widget as a static object */}
                        {page.widgets?.map((widget) => (
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
                            />
                        ))}
                    </div>
                </div>
            </body>
        </html>
    );
}