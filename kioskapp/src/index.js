import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import MainPage from "./pages/mainPage";
import Kiosk from "./pages/kiosk";
import { AuthProvider } from "react-oidc-context";
import { StoreContext } from "./store";
import Cart from "./pages/cart";
import Final from "./pages/final";
import Protected from "./pages/protected";

const oidcConfig = {
  authority: `http://localhost:8080/realms/bezpieczenstwo`,
  client_id: "kiosk-app",
  redirect_uri: `http://localhost:5000`,
  onSigninCallback: (_user) => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/kiosk",
    element: (
      <Protected>
        <Kiosk />
      </Protected>
    ),
  },
  {
    path: "/cart",
    element: (
      <Protected>
        <Cart />
      </Protected>
    ),
  },
  {
    path: "/final/:number",
    element: (
      <Protected>
        <Final />
      </Protected>
    ),
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider {...oidcConfig}>
    <StoreContext.Provider value={{}}>
      <RouterProvider router={router} />
    </StoreContext.Provider>
  </AuthProvider>
);
