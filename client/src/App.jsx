import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import RootLayout from "./RootLayout";

const router = createBrowserRouter([
  {
    path: '/', element: <RootLayout />,
    children: [
      { path: "/", element: <Users /> },
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
