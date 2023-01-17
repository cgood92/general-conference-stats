import React from "react";
import { ProgressCircle } from "@adobe/react-spectrum";

export default function Loading() {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <ProgressCircle size="L" isIndeterminate aria-label="Loading" />
      <p>Loading lots of cool data...</p>
    </div>
  );
}
