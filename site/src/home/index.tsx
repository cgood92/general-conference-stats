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
          <StyledLink to="/methodology">
            50 years of General Conference talks
          </StyledLink>{" "}
          from the Church of Jesus Christ of Latter-day Saints. This website is
          not endorsed by or associated with the church.
        </p>
        <p>
          Using the <StyledLink to="/word-counts">word counts tool</StyledLink>,
          you can see how General Conference consistently focuses on Jesus
          Christ, families, love and faith. You can see that the prophet{" "}
          <StyledLink
            to={`/word-counts?speaker=${encodeURIComponent(
              "Russell M. Nelson"
            )}`}
          >
            Russell M. Nelson
          </StyledLink>{" "}
          gives special attention to temples.
        </p>
        <p>
          Using the{" "}
          <StyledLink to="/search-trends">search trends tool</StyledLink>, you
          can analyze trends of some words and phrases over the past 50 years.
          While not of great importance, there were still some interesting
          things I discovered.
        </p>
        <p>
          By using linear regression, I was able to see a few long-term trends
          in some words, such as:
        </p>
        <ul>
          <li>
            Terms used for deity have changed slightly. The term{" "}
            {createTrendLink("Lord", [" Lord"])} and{" "}
            {createTrendLink("God", [" God"])} trended downward, while{" "}
            {createTrendLink("Jesus", [" Jesus"])},{" "}
            {createTrendLink("Christ", [" Christ"])},{" "}
            {createTrendLink("Savior", [" Savior"])}, and{" "}
            {createTrendLink("Heavenly Father", ["Heavenly Father"])} have
            trended upward.
          </li>
          <li>
            Some terms that have trended downward include:{" "}
            {createTrendLink("kingdom", [" kingdom "])},{" "}
            {createTrendLink("prophet", [" prophet"])} and{" "}
            {createTrendLink("earth", [" earth "])}.
          </li>
          <li>
            Some terms that have trended upward include:{" "}
            {createTrendLink("faith", [" faith "])},{" "}
            {createTrendLink("covenants", [" covenant"])},{" "}
            {createTrendLink("temple", [" temple"])},{" "}
            {createTrendLink("atonement", [" atonement "])} and{" "}
            {createTrendLink("help", [" help "])}.
          </li>
        </ul>
        <p>
          {createTrendLink("Second Coming", ["Second Coming"])},{" "}
          {createTrendLink("tithing", ["tithing"])}, and{" "}
          {createTrendLink("sabbath", ["sabbath"])} have spikes of usage.
        </p>
        <p>
          It was a surprise to me that some terms I thought must certainly be
          increasing were actually not, such as{" "}
          {createTrendLink("pornography", ["pornograph(y|ic)"])},{" "}
          {createTrendLink("addiction", [" addicti(on|ve) "])},{" "}
          {createTrendLink("word of wisdom", ["word of wisdom"])},{" "}
          {createTrendLink("modesty", ["modesty"])} and{" "}
          {createTrendLink("drugs", [" drugs "])}.
        </p>
        <p>
          Other terms were interesting to spot check, such as{" "}
          {createTrendLink("R-rated movies", [
            "(\\WR.rat(ed|ing)\\W|\\Wrat(ed|ing).R\\W)",
          ])}
          , {createTrendLink("social media", [" social media "])},{" "}
          {createTrendLink("gambling", [" gambl(e|ing) "])},{" "}
          {createTrendLink("tattoos", ["tattoo(ing|ed)?"])} and{" "}
          {createTrendLink("LGBTQ", [
            "(LGBT|homo.?sexual| gays |lesbian|same.?sex)",
          ])}
          .
        </p>
      </Content>
    </View>
  );
}

function createTrendLink(title: string, terms: string[]) {
  const href = `/search-trends?${terms
    .map((term) => `searchTerms=${encodeURIComponent(term)}`)
    .join("&")}`;

  return <StyledLink to={href}>{title}</StyledLink>;
}

type StyledLinkProps = {
  children: React.ReactNode;
  to: string;
};

function StyledLink({ children, to }: StyledLinkProps) {
  return (
    <Link>
      <RouterLink to={to}>{children}</RouterLink>
    </Link>
  );
}
