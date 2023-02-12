import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, Navigate, RouterProvider } from "react-router-dom";
import Home from "./home";
import Layout from "./layout";
import Loading from "./loading";
import "./index.css";

const Growth = React.lazy(() => import("./growth"));
const WordCounts = React.lazy(() => import("./word-counts"));
const SearchTrends = React.lazy(() => import("./search-trends"));
const Methodology = React.lazy(() => import("./methodology"));
const VocabularySize = React.lazy(() => import("./vocabulary-size"));

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
