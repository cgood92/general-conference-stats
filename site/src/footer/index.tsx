import React from "react";
import { Link, View } from "@adobe/react-spectrum";

export default function Footer() {
  return (
    <View
      backgroundColor="static-gray-200"
      height="size-200"
      marginTop="auto"
      padding="size-25"
      paddingX="size-100"
      UNSAFE_style={{ fontSize: 12 }}
    >
      Open source project on{" "}
      <Link>
        <a
          href="https://github.com/cgood92/general-conference-stats"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </Link>
    </View>
  );
}
