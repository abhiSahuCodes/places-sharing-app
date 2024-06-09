import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import React, { lazy, Suspense } from "react";
import RootLayout from "./RootLayout";
import { AuthContext } from "./shared/context/auth-context.jsx";
import { useContext, useEffect, useRef } from "react";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner.jsx";

const Users = lazy(() => import("./user/pages/Users"));
const NewPlace = lazy(() => import("./places/pages/NewPlace.jsx"));
const UserPlaces = lazy(() => import("./places/pages/UserPlaces"));
const UpdatePlace = lazy(() => import("./places/pages/UpdatePlace"));
const Auth = lazy(() => import("./user/pages/Auth"));

const App = () => {
  const auth = useContext(AuthContext);

  let logoutTimer = useRef();

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      auth.login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [auth.login]);

  useEffect(() => {
    if (auth.token && auth.tokenExpirationDate) {
      const remainingTime =
        auth.tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer.current = setTimeout(auth.logout, remainingTime);
    } else {
      clearTimeout(logoutTimer.current);
    }

    return () => {
      clearTimeout(logoutTimer.current);
    };
  }, [auth.token, auth.logout, auth.tokenExpirationDate]);

  let routes = [
    { path: "/", element: <Users /> },
    { path: "/:userId/places", element: <UserPlaces /> },
  ];

  if (auth.token) {
    routes = [
      ...routes,
      { path: "/places/new", element: <NewPlace /> },
      { path: "/places/:placeId", element: <UpdatePlace /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ];
  } else {
    routes = [
      ...routes,
      { path: "/auth", element: <Auth /> },
      { path: "*", element: <Navigate to="/auth" replace /> },
    ];
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: routes,
    },
  ]);
  return (
    <Suspense
      fallback={
        <p className="center">
          <LoadingSpinner />
        </p>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default App;
