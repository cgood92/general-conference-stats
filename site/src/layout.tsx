import React from "react";
import { defaultTheme, Flex, Provider, View } from "@adobe/react-spectrum";
import Footer from "./footer";
import Header from "./header";

type LayoutProps = {
  children: any;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <Provider theme={defaultTheme} colorScheme="light" height="100%">
      <Flex direction="column" height="100%">
        <Header />
        <View
          backgroundColor="static-gray-100"
          flex={1}
          height="100%"
          paddingX={{
            base: "size-50",
            L: "10%",
          }}
          paddingY="size-200"
          UNSAFE_style={{ overflow: "auto" }}
        >
          {children}
        </View>
        <Footer />
      </Flex>
    </Provider>
  );
}
