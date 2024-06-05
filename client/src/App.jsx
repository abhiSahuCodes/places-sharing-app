import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import RootLayout from "./RootLayout";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./user/pages/Auth";
import { AuthContext } from "./shared/context/auth-context.jsx";
import { useContext, useEffect, useRef } from "react";

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

    return() => {
      clearTimeout(logoutTimer.current);
    }
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
  return <RouterProvider router={router} />;
};

export default App;
