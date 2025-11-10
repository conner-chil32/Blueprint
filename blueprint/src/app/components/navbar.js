"use client";

import CreateButton from "./CreateRouteButton.js";
import CreateImage from "./CreateRouteImage.js";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [loginStatus, setloginStatus] = useState(false);
  const [theme, setTheme] = useState("dark");

  // Load saved theme
  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const loggedInCookie = cookies.find(cookie => cookie.startsWith("UserCookie"));
    const savedTheme = localStorage.getItem("theme");

    if (loggedInCookie) setloginStatus(true);
    
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

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
            <CreateButton code="features" />
            <CreateButton code="pricing" />
            <CreateButton code="canvas" />
          </div>

          {/* Right Side */}
          <div className="nav-right">
            <CreateButton code="navtest" />
            <CreateButton code={loginStatus ? 'logout' : 'login'} />

            {/* Theme Toggle */}
            <div className="theme-toggle">
              <input
                type="checkbox"
                id="theme-switch"
                checked={theme === "light"}
                onChange={toggleTheme}
              />
              <label htmlFor="theme-switch" className="toggle-label">
                <span className="toggle-knob">
                  {theme === "light" ? "🌅" : "🌌"}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
