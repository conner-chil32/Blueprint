// components/navbar.js
"use client";
import CreateButton from "./CreateRouteButton.js"
import CreateImage from "./CreateRouteImage.js"
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [loginStatus, setloginStatus] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const cookies = document.cookie.split('; ');
    const loggedInCookie = cookies.find(cookie => cookie.startsWith('UserCookie'));
    if (loggedInCookie !== undefined) setloginStatus(true);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="topBarBackground">
      <div className="navbar">
        <div className="nav-left">
          <CreateImage code="logo" />
          <CreateButton code="features" />
          <CreateButton code="pricing" />
          <CreateButton code="canvas" />
        </div>
        <div className="nav-right">
          <CreateButton code='navtest' />
          <CreateButton code={loginStatus ? 'logout' : 'login'} />
          <div className="theme-toggle">
            <input 
              type="checkbox" 
              id="theme-switch" 
              checked={theme === 'light'} 
              onChange={toggleTheme} 
            />
            <label htmlFor="theme-switch" className="toggle-label">
              <span className="toggle-knob">
                {theme === 'light' ? '💡' : '💡'}
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}