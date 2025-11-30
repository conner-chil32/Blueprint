"use client";

import { Widget } from "./Widget";

export function Video(props) {
    const {
        id,
        videoUrl = "",
        autoplay = true,
        controls = false,
        loop = false,
        muted = true,
        objectFit = "contain",
        backgroundColor,
    } = props;

    // If url is empty/whitespace, don't pass "" to <video src>
    const hasSrc =
        typeof videoUrl === "string" && videoUrl.trim().length > 0;
    const safeSrc = hasSrc ? videoUrl.trim() : null;

    return (
        <Widget
        {...props}
        style={{
            backgroundColor: backgroundColor || "#000000",
            overflow: "hidden",
            ...(props.style || {}),
        }}
        >
        {hasSrc ? (
            <video
            src={safeSrc}               // null never gets set; "" is avoided
            autoPlay={autoplay}
            controls={controls}
            loop={loop}
            muted={muted}
            style={{
                width: "100%",
                height: "100%",
                display: "block",
                objectFit,
            }}
            />
        ) : (
            // placeholder so we can see/drag/resize the widget
            <div
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
            }}
            aria-label="No video source set"
            >
            Set a video URL (no src yet)
            </div>
        )}
        </Widget>
    );
}
