import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Welcome from "./Pages/Welcome";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import { useAuth } from "./Store/useAuth";
import Landing from "./Pages/Landing";
import Form from "./Pages/Form";
import Success from "./Pages/Success";

const App = () => {
  const { auth } = useAuth();
  const router = createBrowserRouter([
    {
      path: "/start",
      element: <Welcome />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/home",
      element: auth?.isAuth ? <Home /> : <Navigate to="/login" replace />,
    },
    {
      path: "/",
      element: <Landing />,
    },
    {
      path: "/submit",
      element: <Form />,
    },
    {
      path: "/done",
      element: <Success />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
