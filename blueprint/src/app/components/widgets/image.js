"use client";

import { Widget } from "./Widget";

export function Image(props) {
  const {
    src = "/images/placeholder.png",
    alt = "Image",
    objectFit = "cover",
    backgroundColor,
    showBorder = false,
    borderColor = "#cccccc",
    radius = 0,
  } = props;

  const hasSrc = typeof src === "string" && src.trim().length > 0;

  return (
    <Widget
      {...props}
      style={{
        backgroundColor: backgroundColor || "#ffffff",
        border: showBorder ? `1px solid ${borderColor}` : "none",
        overflow: "hidden",
        borderRadius: radius,
        ...(props.style || {}),
      }}
    >
      {hasSrc ? (
        <img
          src={src}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit,
            display: "block",
            userSelect: "none",
            pointerEvents: "none", // lets you drag the widget without grabbing the img
          }}
        />
      ) : (
        <div
          aria-label="No image source set"
          style={{
            width: "100%",
            height: "100%",
            display: "grid",
            placeItems: "center",
            fontSize: 12,
            opacity: 0.7,
            userSelect: "none",
            textAlign: "center",
            padding: 8,
          }}
        >
          Set an image URL
        </div>
      )}
    </Widget>
  );
}
