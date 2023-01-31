import React from "react";
import { Divider, Flex, Link, View } from "@adobe/react-spectrum";
import Home from "@spectrum-icons/workflow/Home";
import { NavLink } from "react-router-dom";
import "./index.css";
import usePageTracking from "../usePageTracking";

export default function Header() {
  usePageTracking();

  return (
    <View
      backgroundColor="static-gray-200"
      minWidth="size-900"
      padding="size-100"
    >
      <Flex alignItems="center" gap="size-300" marginStart="size-150">
        <Link UNSAFE_style={{ color: "#222", textDecoration: "none" }}>
          <NavLink to="/" style={{ textDecoration: "none" }}>
            <Home />
          </NavLink>
        </Link>
        <Divider orientation="vertical" size="M" />
        <Link>
          <NavLink to="/growth">Growth charts</NavLink>
        </Link>
        <Divider orientation="vertical" size="M" />
        <Link>
          <NavLink to="/word-counts">Word counts</NavLink>
        </Link>
        <Divider orientation="vertical" size="M" />
        <Link>
          <NavLink to="/search-trends">Search trends</NavLink>
        </Link>
        <Divider orientation="vertical" size="M" />
        <Link>
          <NavLink to="/vocabulary-size">Vocabulary size</NavLink>
        </Link>
        <Divider orientation="vertical" size="M" />
        <Link>
          <NavLink to="/list-of-talks">List of talks</NavLink>
        </Link>
      </Flex>
    </View>
  );
}
