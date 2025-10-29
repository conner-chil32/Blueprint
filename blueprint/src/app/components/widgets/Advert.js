"use client";

import { Widget } from "./Widget";

export function Advert(props) {
    const {
        imageUrl = "",
        linkUrl = "www.google.com",
        alt = "Advertisement",
        objectFit = "cover",
        showBorder = true,
        borderColor = "#333",
    } = props;

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
        <a href={linkUrl} target="_blank" rel="noreferrer" style={{ display: "block", width: "100%", height: "100%" }}>
            <img
            src={imageUrl}
            alt={alt}
            style={{ width: "100%", height: "100%", objectFit, display: "block" }}
            />
        </a>
        </Widget>
    );
}
