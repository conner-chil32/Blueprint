"use client";

import { useEffect, useRef } from "react";
import { Widget } from "./Widget";

export function Text(props) {
  const {
    id,
    text = "Edit me",
    fontSize = 18,
    color = "#111111",
    fontFamily = "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
    fontWeight = 400,
    textAlign = "left",
    lineHeight = 1.35,
    letterSpacing = 0,
    padding = 8,
    backgroundColor = "transparent",
    isEditing = false,
    onTextChange,
    changeWidgetProperty,
    style,
    onDoubleClick, // may be provided by WidgetRenderer
    ...rest
  } = props;

  const textareaRef = useRef(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      const len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
    }
  }, [isEditing]);

  const commitText = (next) => {
    if (typeof onTextChange === "function") {
      onTextChange(next);
    } else if (typeof changeWidgetProperty === "function" && id != null) {
      changeWidgetProperty(id, { text: next });
    }
  };

  const exitEditing = () => {
    if (typeof changeWidgetProperty === "function" && id != null) {
      changeWidgetProperty(id, { isEditing: false });
    }
  };

  const enterEditing = (e) => {
    e.stopPropagation();
    if (typeof changeWidgetProperty === "function" && id != null) {
      changeWidgetProperty(id, { isEditing: true });
    }
  };

  const justifyMap = { left: "flex-start", center: "center", right: "flex-end" };

  return (
    <Widget
      {...rest}
      id={id}
      // Forward any onDoubleClick passed by WidgetRenderer;
      // if not provided, fall back to our own that toggles editing.
      onDoubleClick={onDoubleClick ?? enterEditing}
      style={{
        backgroundColor,
        overflow: "hidden",
        ...(style || {}),
      }}
      // Keep other Widget props (x,y,width,height, etc.) via {...rest}
    >
      {!isEditing && (
        <div
          // IMPORTANT: do NOT disable pointer events here,
          // so the Widget container can receive clicks/double-clicks.
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: justifyMap[textAlign] || "flex-start",
            padding,
            boxSizing: "border-box",
            userSelect: "text",
          }}
        >
          <span
            style={{
              display: "block",
              width: "100%",
              fontSize,
              color,
              fontFamily,
              fontWeight,
              textAlign,
              lineHeight,
              letterSpacing,
              wordBreak: "break-word",
              whiteSpace: "pre-wrap",
            }}
          >
            {text}
          </span>
        </div>
      )}

      {isEditing && (
        <div
          // Prevent drag/move & selection changes while editing.
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            padding,
            boxSizing: "border-box",
            background: "rgba(255,255,255,0.92)",
          }}
        >
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => commitText(e.target.value)}
            onBlur={exitEditing}
            onKeyDown={(e) => {
              if (
                (e.key === "Enter" && (e.metaKey || e.ctrlKey)) ||
                e.key === "Escape"
              ) {
                e.preventDefault();
                exitEditing();
              }
            }}
            aria-label="Edit text"
            style={{
              flex: 1,
              width: "100%",
              height: "100%",
              resize: "none",
              border: "1px solid #ddd",
              borderRadius: 6,
              outline: "none",
              padding: 8,
              fontSize,
              color,
              fontFamily,
              fontWeight,
              lineHeight,
              letterSpacing,
              textAlign,
              background: "white",
            }}
          />
        </div>
      )}
    </Widget>
  );
}
