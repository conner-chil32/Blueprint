// /pages/raw-html.js
export default function RawHTMLPage() {
    const htmlContent = `
      <h1>Welcome to My Page</h1>
      <p>This is some <strong>raw HTML</strong> content.</p>
    `;
  
    return (
      <div>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    );
  }