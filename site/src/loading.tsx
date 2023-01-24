import React from "react";
import { ProgressCircle } from "@adobe/react-spectrum";

export default function Loading() {
  return (
    <div style={style}>
      <ProgressCircle
        aria-labelledby="loading-cool-data"
        isIndeterminate
        size="L"
      />
      <p id="loading-cool-data">Loading lots of cool data...</p>
    </div>
  );
}

const style: React.CSSProperties = {
  height: "100%",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
};