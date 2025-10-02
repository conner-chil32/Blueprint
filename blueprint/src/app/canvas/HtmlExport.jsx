import { renderToStaticMarkup } from "react-dom/server";
import PageRenderer from "./PageRenderer";

/** Christopher Parsons 9/26/2025
 * Inputs:
 *  page: Page container
 * Renders an incoming react page into HTML. Uses renderToStaticMarkup
 * to render an outlying page with PageRenderer converting the page to
 * static components.
 */
export default function HTMLExport(page) {
    console.log('Rendering page to HTML:', page);

    if (!page) return null;

    const pageToExport = {
        ...page,
    }

    return renderToStaticMarkup(
        <html>
            <head>
                <title>{page.name}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
            </head>

            <body style={{
                width: "100vw",
                height: "100vh",
                backgroundColor: pageToExport.backgroundColor,
                position: "relative",
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "0",
            }}>
                <div style={{
                    position: "relative",
                    width: pageToExport.width + "px",
                    height: pageToExport.height + "px",
                }}>
                    {/* Render the page */}
                    <PageRenderer page={pageToExport} />
                </div>
            </body>
        </html>
    );
}