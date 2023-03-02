import React from "react";
import {
  Content,
  Grid,
  Heading,
  IllustratedMessage,
  Image,
  Link,
  Text,
  View,
  Well,
} from "@adobe/react-spectrum";
import { Link as RouterLink } from "react-router-dom";

import Growth from "./growth.svg";
import Speaker from "./speaker.svg";
import Table from "./table.svg";
import Trend from "./trend.svg";
import "./home.css";

const links = [
  {
    img: Table,
    title: "Word counts",
    to: "/word-counts",
  },
  {
    img: Trend,
    title: "Search trends",
    to: "/search-trends",
  },
  {
    img: Growth,
    title: "Growth",
    to: "/growth",
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
      <Well maxWidth="800px">
        <Text UNSAFE_style={{ fontWeight: "bold" }}>Jump to:</Text>
        <Grid
          columns={{
            base: ["1fr"],
            S: ["1fr"],
            M: ["1fr", "1fr", "1fr", "1fr"],
          }}
          autoRows={{ base: "size-1000", M: "size-2000" }}
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
                UNSAFE_className="home-button"
              >
                <IllustratedMessage>
                  <Image src={link.img} objectFit="cover" />
                  <Heading>{link.title}</Heading>
                </IllustratedMessage>
              </View>
            </RouterLink>
          ))}
        </Grid>
      </Well>
      <Content>
        <Heading level={1}>General Conference Analytics</Heading>
        <p>
          This is an{" "}
          <Link>
            <a
              href="https://github.com/cgood92/general-conference-stats"
              target="_blank"
              rel="noreferrer"
            >
              open-source
            </a>
          </Link>{" "}
          online tool that analyzes the past{" "}
          <Link>
            <RouterLink to="/methodology">
              50 years of General Conference talks
            </RouterLink>
          </Link>{" "}
          from the Church of Jesus Christ of Latter-day Saints. This website is
          not specifically endorsed or associated with the church.
        </p>
        <p>
          I originally wanted to see what were the common themes in the past
          general conference. It eventually led to this website, which allows
          you to not only see common words spoken, but search for trends as
          well.
        </p>
        <p>
          You can see what the prophet{" "}
          <Link>
            <RouterLink to="/word-counts?speaker=Russell+M.+Nelson&start=1971&end=2022">
              Russell M. Nelson talks about most
            </RouterLink>
          </Link>
          , how{" "}
          <Link>
            <RouterLink to="/search-trends?speaker=&start=1971&end=2022&searchTerms=covenants">
              covenants
            </RouterLink>
          </Link>{" "}
          are becoming an increasing focus, and how{" "}
          <Link>
            <RouterLink to="/search-trends?speaker=&start=1971&end=2022&searchTerms=pornography">
              pornography
            </RouterLink>
          </Link>{" "}
          was addressed during the rise of the internet.
        </p>
        <p>
          Mostly, this website is for fun and curiosity. But, it does reenforce
          the fact that, like the Book of Mormon, General Conference is centered
          around{" "}
          <Link>
            <RouterLink to="/word-counts">Jesus Christ</RouterLink>
          </Link>
          .
        </p>
      </Content>
    </View>
  );
}
