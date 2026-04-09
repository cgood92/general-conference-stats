import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, Navigate, RouterProvider } from "react-router-dom";
import Home from "./home";
import Layout from "./layout";
import Loading from "./loading";
import "./index.css";

const lazyWithRetry = <T extends React.ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>
) =>
  React.lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.sessionStorage.getItem("page-has-been-force-refreshed") || "false"
    );

    try {
      const component = await componentImport();
      window.sessionStorage.setItem("page-has-been-force-refreshed", "false");
      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        window.sessionStorage.setItem("page-has-been-force-refreshed", "true");
        window.location.reload();
        return new Promise<{ default: T }>(() => {});
      }
      throw error;
    }
  });

const Growth = lazyWithRetry(() => import("./growth"));
const WordCounts = lazyWithRetry(() => import("./word-counts"));
const SearchTrends = lazyWithRetry(() => import("./search-trends"));
const Methodology = lazyWithRetry(() => import("./methodology"));
const VocabularySize = lazyWithRetry(() => import("./vocabulary-size"));

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
