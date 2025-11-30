"use client";

import { Widget } from "@/components/widgets/Widget.jsx";

export function Image(props) {
  const {
    id,
    imageUrl = "/images/pog_web_logo.png",
    alt = "Image",
    objectFit = "contain",
    backgroundColor,
    borderRadius = 0,
    showBorder = false,
    showInlineUrlInput = false,
    onImageUrlChange,
    changeWidgetProperty,
    style,
    ...rest
  } = props;

  const hasSrc = typeof imageUrl === "string" && imageUrl.trim().length > 0;
  const safeSrc = hasSrc ? imageUrl.trim() : null;

  const handleChange = (next) => {
    if (typeof onImageUrlChange === "function") onImageUrlChange(next);
    else if (typeof changeWidgetProperty === "function" && id != null)
      changeWidgetProperty(id, { imageUrl: next });
  };

  return (
    <Widget
      {...props}
      style={{
        backgroundColor: backgroundColor || "#f5f5f5",
        overflow: "hidden",
        borderRadius,
        border: showBorder ? "1px solid #ddd" : "none",
        ...(style || {}),
      }}
    >
      {hasSrc ? (
        <img
          src={safeSrc}
          alt={alt}
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit,
            display: "block",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
      ) : (
        <div
          aria-label="No image source set"
          title="Set an image URL"
          style={{
            width: "100%",
            height: "100%",
            display: "grid",
            placeItems: "center",
            fontSize: 12,
            opacity: 0.7,
            userSelect: "none",
            padding: 8,
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          Set an image URL (no source yet)
        </div>
      )}

      {showInlineUrlInput ? (
        <div
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            left: 8,
            right: 8,
            bottom: 8,
            display: "flex",
            gap: 8,
            background: "rgba(255,255,255,0.92)",
            padding: 6,
            borderRadius: 6,
          }}
        >
          <input
            type="text"
            placeholder="https://…"
            value={imageUrl}
            onChange={(e) => handleChange(e.target.value)}
            aria-label="Image URL"
            style={{
              flex: 1,
              padding: "6px 8px",
              border: "1px solid #ccc",
              borderRadius: 4,
              outline: "none",
            }}
          />
        </div>
      ) : null}
    </Widget>
  );
}
