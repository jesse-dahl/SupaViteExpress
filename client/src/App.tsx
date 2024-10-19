import React from "react"
import {
  RouterProvider,
} from "react-router-dom";
import './index.css'
import router from "./BrowserRouter";
export const App = () => {

  return (
    <RouterProvider router={router} />
  )
}