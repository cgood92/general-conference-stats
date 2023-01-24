import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Home from "./home";
import Layout from "./layout";
import Loading from "./loading";
import "./index.css";

const Case1 = React.lazy(() => import("./case-1"));
const Case2 = React.lazy(() => import("./case-2"));

const router = createHashRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: "/case-1/*",
    element: (
      <Layout>
        <Suspense fallback={<Loading />}>
          <Case1 />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/case-2/*",
    element: (
      <Layout>
        <Suspense fallback={<Loading />}>
          <Case2 />
        </Suspense>
      </Layout>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterProvider router={router} />
);
