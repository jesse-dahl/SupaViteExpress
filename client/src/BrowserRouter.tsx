import React from "react"
import {
  createBrowserRouter,
} from "react-router-dom";
import './index.css'
import Root from './routes/Root';
import ErrorPage from './error-page';
// import SignInPage from './routes/SignIn';
// import SignUpPage from './routes/SignUp';
import Home from "./routes/Home";
// import AuthRoute from "./routes/AuthRoute";

const router: any = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/home",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  // {
  //   element: <AuthRoute />,
  //   children: [
  //     {
  //       path: "home",
  //       element: <Home />
  //     },
  //   ]
  // },
  // {
  //   path: "sign-in",
  //   element: <SignInPage />,
  // },
  // {
  //   path: "sign-up",
  //   element: <SignUpPage />,
  // },
]);

export default router