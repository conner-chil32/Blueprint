// app/components/navbar.js
"use client";

import CreateButton from "./CreateRouteButton.js";
import CreateImage from "./CreateRouteImage.js";
import { useState, useEffect } from "react";

export default function Navbar({ initialTheme = "dark" }) {
  const [loginStatus, setloginStatus] = useState(false);
  const [theme, setTheme] = useState(initialTheme);

  // Load saved theme and login cookie on first mount
  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const loggedInCookie = cookies.find((cookie) =>
      cookie.startsWith("UserCookie")
    );
    if (loggedInCookie) setloginStatus(true);

    // Prefer localStorage theme if it exists
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      // Fall back to theme coming from SSR
      document.documentElement.setAttribute("data-theme", initialTheme);
    }
  }, [initialTheme]);

  // Whenever `theme` changes, update <html>, localStorage, and cookie
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    document.cookie = `theme=${theme}; path=/; max-age=31536000`;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <>
      {/* Cloud layer div for Dawn Mode */}
      <div className="cloud-layer"></div>

      <div className="topBarBackground">
        <div className="navbar">
          {/* Left Side */}
          <div className="nav-left">
            <CreateImage code="logo" type="set" />
            <CreateButton code="portal" />
            <CreateButton code="features" />
            <CreateButton code="pricing" />
            <CreateButton code="canvas" />
          </div>

          {/* Right Side */}
          <div className="nav-right">
            <CreateButton code={loginStatus ? "logout" : "login"} />

            {/* Theme Toggle */}
            <div className="theme-toggle">
              <label htmlFor="theme-switch" className="toggle-label">
                <input
                  type="checkbox"
                  id="theme-switch"
                  checked={theme === "light"}
                  onChange={toggleTheme}
                  className="toggle-input"
                />
                <span className="toggle-track">
                  <span className="toggle-knob" />
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
