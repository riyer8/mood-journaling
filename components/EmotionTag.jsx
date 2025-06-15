// components/EmotionTag.jsx
import React from "react";
import { emotionColors } from "../utils/emotionColors";

export default function EmotionTag({ emotion }) {
  const color = emotionColors[emotion.toLowerCase()] || "#9ca3af"; // default gray

  return (
    <span
      style={{
        backgroundColor: color,
        color: "white",
        padding: "4px 12px",
        borderRadius: "9999px",
        fontSize: "0.875rem",
        fontWeight: "500",
        userSelect: "none",
        marginRight: "8px",
        display: "inline-block",
        minWidth: "64px",
        textAlign: "center",
      }}
    >
      {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
    </span>
  );
}
