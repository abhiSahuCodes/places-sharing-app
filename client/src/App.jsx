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

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <Users /> },
      { path: "/:userId/places", element: <UserPlaces /> },
      { path: "/places/new", element: <NewPlace /> },
      { path: "/places/:placeId", element: <UpdatePlace /> },
      { path: "/auth", element: <Auth /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
