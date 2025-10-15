"use client";

import { Widget } from "./Widget";

export function Advert(props) {
    const {
        staticRender,
        imageUrl = "",
        linkUrl = "https://www.google.com",
        alt = "Advertisement",
        objectFit = "cover",
        showBorder = true,
        borderColor = "#333",
    } = props;

    // Visial part of ad
    const adContent = (
        <img
            src={imageUrl}
            alt={alt}
            style={{ width: "100%", height: "100%", objectFit, display: "block" }}
        />
    );
    // If static render, wrap in anchor tag
    if (staticRender) {
        return (
            <a href={linkUrl} target="_blank" rel="noopener noreferrer" style={{ display: "block", width: "100%", height: "100%" }}>
                {adContent}
            </a>
        );
    }

    return (
        <Widget
            {...props}
            style={{
                backgroundColor: "#fafafa",
                border: showBorder ? `1px dashed ${borderColor}` : "none",
                overflow: "hidden",
                ...props.style,
            }}
        >
            <div style={{ width: "100%", height: "100%", pointerEvents: "none" }}>
                {adContent}
            </div>
        </Widget>
    );
}