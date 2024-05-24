import {createBrowserRouter, Navigate, RouterProvider} from 'react-router-dom';
import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';

const router = createBrowserRouter([
  {path: '/', element: <Users />},
  {path: '/places/new', element: <NewPlace />},
  {path: "*", element: <Navigate to="/" replace />}
])


const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App
