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

  const justifyMap = { left: "flex-start", center: "center", right: "flex-end" };

  return (
    <Widget
      {...props}
      style={{
        backgroundColor,
        overflow: "hidden",
        ...(style || {}),
      }}
    >
      {!isEditing && (
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: justifyMap[textAlign] || "flex-start",
      padding,
      boxSizing: "border-box",
      userSelect: "text",
      pointerEvents: "none",
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
              if ((e.key === "Enter" && (e.metaKey || e.ctrlKey)) || e.key === "Escape") {
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
