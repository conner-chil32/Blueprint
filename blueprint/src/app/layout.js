// app/layout.js
import "./globals.css";
import Navbar from "./components/navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Navbar is now global and persists between pages */}
        <Navbar />

        {/* Push content below the fixed navbar (70px tall) */}
        <main style={{ paddingTop: "15px" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
