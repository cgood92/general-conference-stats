import React from "react";
import { Flex, ProgressCircle } from "@adobe/react-spectrum";

export default function Crunching() {
  return (
    <Flex alignItems="center" gap="size-100" marginTop="size-100">
      <ProgressCircle isIndeterminate size="S" aria-label="Loading..." />
      Crunching the numbers...
    </Flex>
  );
}
