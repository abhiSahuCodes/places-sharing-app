import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import RootLayout from "./RootLayout";
import UserPlaces from "./places/pages/UserPlaces";

const router = createBrowserRouter([
  {
    path: '/', element: <RootLayout />,
    children: [
      { path: "/", element: <Users /> },
      { path: "/:userId/places", element: <UserPlaces /> },
      { path: "/places/new", element: <NewPlace /> },
      { path: "*", element: <Navigate to="/" replace /> } 
    ]
  }
,
]);

const App = () => {
  return (
      <RouterProvider router={router} />
  );
};

export default App;
