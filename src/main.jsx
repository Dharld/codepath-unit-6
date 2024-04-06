import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ProductDetails from "./components/product-details/product-details.component.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App key="app" />,
    children: [
      {
        path: "/products/:id",
        element: <ProductDetails />,
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);
