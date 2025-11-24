// app/layout.js
import "./globals.css";
import Navbar from "./components/navbar";
import { cookies } from "next/headers";

export default async function RootLayout({ children }) {

  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme")?.value;

  const initialTheme =
    themeCookie === "light" || themeCookie === "dark" ? themeCookie : "dark";

  return (
    <html
      lang="en"
      data-theme={initialTheme}
      suppressHydrationWarning
    >
      <body>
        <Navbar initialTheme={initialTheme} />

        <main style={{ paddingTop: "70px" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
