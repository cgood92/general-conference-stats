import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, Navigate, RouterProvider } from "react-router-dom";
import Home from "./home";
import Layout from "./layout";
import Loading from "./loading";
import "./index.css";

const growthImport = import("./growth");
const Growth = React.lazy(() => growthImport);
const wordCountsImport = import("./word-counts");
const WordCounts = React.lazy(() => wordCountsImport);
const searchTrendsImport = import("./search-trends");
const SearchTrends = React.lazy(() => searchTrendsImport);
const methodologyImport = import("./methodology");
const Methodology = React.lazy(() => methodologyImport);
const vocabularySizeImport = import("./vocabulary-size");
const VocabularySize = React.lazy(() => vocabularySizeImport);

const router = createHashRouter([
  {
    path: "/growth",
    element: (
      <Layout>
        <Suspense fallback={<Loading />}>
          <Growth />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/word-counts",
    element: (
      <Layout>
        <Suspense fallback={<Loading />}>
          <WordCounts />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/search-trends",
    element: (
      <Layout>
        <Suspense fallback={<Loading />}>
          <SearchTrends />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/methodology",
    element: (
      <Layout>
        <Suspense fallback={<Loading />}>
          <Methodology />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/vocabulary-size",
    element: (
      <Layout>
        <Suspense fallback={<Loading />}>
          <VocabularySize />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/",
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace={true} />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterProvider router={router} />
);
