import Navbar from "../components/navbar"; // optional: use your navbar if others do

export default function CanvasPage() {
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Canvas Page</title>
      <style>
          :root {
              --primary: #2563eb;
              --secondary: #1e40af;
              --background: #f8fafc;
              --surface: #ffffff;
              --border: #e2e8f0;
          }

          html, body {
              height: 100%;
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
          }

          .navbar {
              background-color: var(--primary);
              padding: 12px 24px;
              position: fixed;
              top: 0;
              width: 100%;
              z-index: 1000;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }

          .nav-items {
              display: flex;
              gap: 32px;
              max-width: 1200px;
              margin: 0 auto;
              justify-content: center;
          }

          .nav-items a {
              color: white;
              text-decoration: none;
              padding: 8px 12px;
              border-radius: 6px;
              transition: all 0.2s ease;
          }

          .nav-items a:hover {
              background-color: var(--secondary);
          }

          .main-container {
              display: flex;
              height: 100vh;
              padding-top: 60px;
          }

          .left-panel {
              width: 15%;
              min-width: 300px;
              background: var(--surface);
              border-right: 1px solid var(--border);
              padding: 20px;
              display: flex;
              flex-direction: column;
              overflow-y: auto;
          }

          .canvas-area {
              width: 85%;
              background-color: var(--surface);
              padding: 24px;
              position: relative;
          }

          .canvas-content {
              border: 2px dashed #cbd5e1;
              border-radius: 12px;
              height: calc(100vh - 108px);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #94a3b8;
              font-size: 1.125rem;
              transition: border-color 0.2s ease;
          }

          .control-menu {
              display: flex;
              gap: 15px;
              padding-bottom: 20px;
              margin-bottom: 20px;
              border-bottom: 1px solid var(--border);
          }

          .control-menu button {
              padding: 8px 16px;
              border: none;
              border-radius: 6px;
              background: var(--primary);
              color: white;
              cursor: pointer;
              transition: all 0.2s ease;
          }

          .section-title {
              color: #64748b;
              font-size: 0.875rem;
              font-weight: 600;
              padding: 12px 8px;
              text-transform: uppercase;
          }

          .category-item {
              display: block;
              width: 100%;
              padding: 10px 16px;
              margin: 4px 0;
              border: none;
              background: none;
              text-align: left;
              border-radius: 6px;
              cursor: move;
              transition: all 0.2s ease;
              color: #1e293b;
          }

          .category-item:hover {
              background-color: #f1f5f9;
              transform: translateX(4px);
          }

          .divider {
              height: 1px;
              background-color: var(--border);
              margin: 16px 0;
          }
      </style>
  </head>
  <body>
      <nav class="navbar">
          <div class="nav-items">
              <a href="/">Home</a>
              <a href="/features">Features</a>
              <a href="/Pricing">Pricing</a>
              <a href="/Admin-Page">Admin Page</a>
              <a href="#">Account</a>
          </div>
      </nav>

      <div class="main-container">
          <div class="left-panel">
              <div class="control-menu">
                  <button onclick="alert('File')">File</button>
                  <button onclick="alert('Edit')">Edit</button>
                  <button onclick="alert('Undo')">Undo</button>
                  <button onclick="alert('Redo')">Redo</button>
              </div>

              <div class="section-title">Templates</div>
              <button class="category-item">Website Templates</button>
              <button class="category-item">Blog Templates</button>

              <div class="divider"></div>

              <div class="section-title">Text Elements</div>
              <button class="category-item">Headings</button>
              <button class="category-item">Paragraphs</button>

              <div class="divider"></div>

              <div class="section-title">UI Elements</div>
              <button class="category-item">Buttons</button>
              <button class="category-item">Forms</button>
              <button class="category-item">Images</button>
          </div>

          <div class="canvas-area">
              <div class="canvas-content" id="canvas">
                  Drop elements here to build your page
              </div>
          </div>
      </div>
  </body>
  </html>
  `;

  return (
    <>
      <Navbar />
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </>
  );
}
