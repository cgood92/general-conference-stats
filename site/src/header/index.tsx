import React from "react";
import { Divider, Flex, Link, View } from "@adobe/react-spectrum";
import Home from "@spectrum-icons/workflow/Home";
import { NavLink } from "react-router-dom";
import "./index.css";

export default function Header() {
  return (
    <View
      backgroundColor="static-gray-200"
      minWidth="size-900"
      padding="size-100"
    >
      <Flex gap="size-300" alignItems="center" marginStart="size-150">
        <Link UNSAFE_style={{ color: "#222", textDecoration: "none" }}>
          <NavLink to="/" style={{ textDecoration: "none" }}>
            <Home />
          </NavLink>
        </Link>
        <Divider orientation="vertical" size="M" />
        <Link>
          <NavLink to="/case-1">Case 1</NavLink>
        </Link>
        <Divider orientation="vertical" size="M" />
        <Link>
          <NavLink to="/case-2">Case 2</NavLink>
        </Link>
      </Flex>
    </View>
  );
}
