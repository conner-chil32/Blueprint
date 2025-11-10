"use client";
import React, { useMemo, useState, useRef, useCallback, useEffect } from "react";
import { Widget } from "./Widget";

function makeSrcDoc(html) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <style>
      html, body { margin:0; padding:0; border:0; background:transparent; }
    </style>
    <base target="_blank" />
  </head>
  <body>
    ${html || ""}
    <script>
      document.addEventListener('click', function(event) {
        var anchor = event.target.closest('a');
        if (!anchor || !anchor.getAttribute('href')) return;
        anchor.setAttribute('target', '_blank');
        anchor.setAttribute('rel', 'noopener noreferrer');
      }, true);
    </script>
  </body>
</html>`;
}

export function CustomHTML({ scale, html, sandbox = true, ...props }) {
  const srcDoc = useMemo(() => makeSrcDoc(html), [html]);
  const [isHandleVisible, setIsHandleVisible] = useState(false);
  const hideHandleTimeoutRef = useRef(null);

  const clearHideTimeout = useCallback(() => {
    if (hideHandleTimeoutRef.current) {
      clearTimeout(hideHandleTimeoutRef.current);
      hideHandleTimeoutRef.current = null;
    }
  }, []);

  const showHandle = useCallback(() => {
    clearHideTimeout();
    setIsHandleVisible(true);
  }, [clearHideTimeout]);

  const hideHandle = useCallback((delay = 0) => {
    clearHideTimeout();
    hideHandleTimeoutRef.current = setTimeout(() => {
      setIsHandleVisible(false);
      hideHandleTimeoutRef.current = null;
    }, delay);
  }, [clearHideTimeout]);

  useEffect(() => {
    if (props.isSelected) {
      showHandle();
    } else {
      hideHandle();
    }
  }, [props.isSelected, showHandle, hideHandle]);

  useEffect(() => () => clearHideTimeout(), [clearHideTimeout]);

  return (
    <Widget
      {...props}
      scale={scale}
      /*Stop the shared frame from drawing a border/outline */
      useOuterBorderFrame={false}
      /*Tell Widget/RND what the drag handle class is */
      dragHandleClassName="widget-drag-handle"
      style={{ ...props.style, backgroundColor: "transparent" }}
      header={(
        // This thin bar is the drag handle
        <div
          className="widget-drag-handle"
          style={{
            height: 22,
            cursor: "move",
            background: isHandleVisible ? "rgba(59, 130, 246, 0.35)" : "transparent",
            borderBottom: `1px solid ${isHandleVisible ? "rgba(59, 130, 246, 0.5)" : "transparent"}`,
            userSelect: "none",
            transition: "background 120ms ease, border-color 120ms ease, opacity 120ms ease",
            opacity: isHandleVisible ? 1 : 0,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            pointerEvents: "auto",
          }}
          onMouseEnter={showHandle}
          onMouseLeave={() => hideHandle(800)}
          onFocus={showHandle}
          onBlur={() => hideHandle(800)}
          onTouchStart={showHandle}
          onTouchEnd={() => hideHandle(800)}
        />
      )}
    >
      <div
        onMouseMove={showHandle}
        onMouseLeave={() => hideHandle(800)}
        onTouchStart={showHandle}
        onTouchEnd={() => hideHandle(800)}
        style={{ width: "100%", height: "100%" }}
      >
        <iframe
          srcDoc={srcDoc}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            outline: "none",
            boxShadow: "none",
            display: "block",
            background: "transparent",
          }}
          sandbox={sandbox ? "allow-scripts allow-forms allow-pointer-lock allow-popups" : undefined}
        />
      </div>
    </Widget>
  );
}
