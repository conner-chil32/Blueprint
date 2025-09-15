"use client";

import { Widget } from "./Widget";

export function Text(props) {
  const {
    text = "Double-click or use the right panel to edit text.",
    fontSize = 18,
    color = "#111111",
    fontFamily = "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
    fontWeight = 400,
    textAlign = "left",
    lineHeight = 1.35,
    letterSpacing = 0,
    backgroundColor,
    padding = 8,
  } = props;

  const justifyMap = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
  };

  return (
    <Widget
      {...props}
      style={{
        backgroundColor: backgroundColor || "transparent",
        overflow: "hidden",
        ...(props.style || {}),
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: justifyMap[textAlign] || "flex-start",
          padding,
          boxSizing: "border-box",
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
            userSelect: "text",
          }}
        >
          {text}
        </span>
      </div>
    </Widget>
  );
}
