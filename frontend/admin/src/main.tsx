import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import HomePage from "./components/HomePage.tsx";
import SignUpPage from "./components/SignUpPage.tsx";
import { Toaster } from "@/components/ui/toaster";
import SignInPage from "./components/SignInPage.tsx";
import OrdersPage from "./components/OrdersPage.tsx";
import ProductsPage from "./components/ProductsPage.tsx";
import ProductsDetails from "./components/ProductDetails.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/orders",
        element: <OrdersPage />,
      },
      {
        path: "/products",
        element: <ProductsPage />,
      },
      {
        path: "/products/:id",
        element: <ProductsDetails />,
      },
    ],
  },
  {
    path: "/sign-up",
    element: <SignUpPage />,
  },
  {
    path: "/sign-in",
    element: <SignInPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <RouterProvider router={router} />
    <Toaster />
  </>
);
