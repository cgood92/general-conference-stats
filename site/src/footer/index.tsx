import React from "react";
import { View } from "@adobe/react-spectrum";

export default function Footer() {
  return (
    <View
      marginTop="auto"
      backgroundColor="static-gray-200"
      height="size-250"
      padding="size-100"
    >
      Open source project on{" "}
      <a href="https://github.com/cgood92/general-conference-stats">GitHub</a>
    </View>
  );
}
