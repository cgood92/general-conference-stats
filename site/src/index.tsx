import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Home from "./home";
import Layout from "./layout";
import Loading from "./loading";
import "./index.css";

const Growth = React.lazy(() => import("./growth"));
const WordCounts = React.lazy(() => import("./word-counts"));
const SearchTrends = React.lazy(() => import("./search-trends"));
const ListOfTalks = React.lazy(() => import("./list-of-talks"));

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
    path: "/list-of-talks",
    element: (
      <Layout>
        <Suspense fallback={<Loading />}>
          <ListOfTalks />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/*",
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterProvider router={router} />
);
