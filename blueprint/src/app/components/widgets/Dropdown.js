"use client";

import { Widget } from "./Widget";

export function Dropdown(props) {
    const {
        id,
        options = ["Option 1", "Option 2", "Option 3"],
        value = "Option 1",
        fontSize = 14,
        textColor = "#111111",
        backgroundColor,
        onValueChange,
        changeWidgetProperty,
    } = props;

    const handleChange = (e) => {
        const next = e.target.value;
        if (typeof onValueChange === "function") {
        onValueChange(next);
        } else if (typeof changeWidgetProperty === "function" && id != null) {
        changeWidgetProperty(id, { value: next });
        }
    };

    return (
        <Widget
        {...props}
        style={{
            backgroundColor: backgroundColor || "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 8,
            ...(props.style || {}),
        }}
        >
        <select
            value={value}
            onChange={handleChange}
            style={{
            width: "100%",
            height: "100%",
            fontSize,
            color: textColor,
            background: "transparent",
            border: "1px solid #ccc",
            borderRadius: 6,
            outline: "none",
            padding: "4px 8px",
            }}
        >
            {options.map((opt, i) => (
            <option key={i} value={opt}>
                {opt}
            </option>
            ))}
        </select>
        </Widget>
    );
}
