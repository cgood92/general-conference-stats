import React from "react";
import { Flex, ProgressCircle, Text } from "@adobe/react-spectrum";

export default function Crunching() {
  return (
    <Flex alignItems="center" gap="size-100" marginTop="size-100">
      <ProgressCircle
        isIndeterminate
        size="S"
        aria-labelledby="crunching-numbers"
      />
      <Text id="crunching-numbers">Crunching the numbers...</Text>
    </Flex>
  );
}
