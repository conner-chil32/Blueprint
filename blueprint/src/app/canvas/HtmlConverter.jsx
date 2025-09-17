export function RenderPage(page) {
    // Render a full page, and for each widget run a function to convert it to html
    const html = `
    <!DOCTYPE html>
    <html>
        <body>
        <p>Test</p>
        </body>
    </html>
    `;

    return html.replace(/\s+/g, ' ').trim();
}

function RenderWidget(widget) {
    
}