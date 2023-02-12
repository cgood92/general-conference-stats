import React from "react";
import {
  Grid,
  Heading,
  IllustratedMessage,
  Image,
  View,
} from "@adobe/react-spectrum";
import { Link as RouterLink } from "react-router-dom";

import Growth from "./growth.svg";
import Speaker from "./speaker.svg";
import Table from "./table.svg";
import Trend from "./trend.svg";

const links = [
  {
    img: Growth,
    title: "Growth",
    to: "/growth",
  },
  {
    img: Table,
    title: "Word count",
    to: "/word-counts",
  },
  {
    img: Trend,
    title: "Search trends",
    to: "/search-trends",
  },
  {
    img: Speaker,
    title: "Vocabulary size",
    to: "/vocabulary-size",
  },
];

export default function Home() {
  return (
    <View height="100%">
      <Grid
        columns={{ base: ["1fr"], S: ["1fr"], M: ["1fr", "1fr"] }}
        autoRows={{ base: "size-2000", M: "size-3000" }}
        gap="size-100"
      >
        {links.map((link) => (
          <RouterLink
            to={link.to}
            key={link.title}
            style={{
              textDecoration: "none",
            }}
          >
            <View
              borderColor="static-gray-200"
              borderWidth="thick"
              borderRadius="medium"
              height="100%"
            >
              <IllustratedMessage>
                <Image src={link.img} objectFit="cover" />
                <Heading>{link.title}</Heading>
              </IllustratedMessage>
            </View>
          </RouterLink>
        ))}
      </Grid>
    </View>
  );
}
