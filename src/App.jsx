import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './index.css'
import Home from './pages/Home'
import { RouterProvider } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'
import HomeLayout from './layouts/HomeLayout'
import Register from './features/auth/Register'
import Welcome from './pages/Onboarding'

function App() {
  const router = createBrowserRouter([
    {path:"/",
      element:<Welcome/>
    },
    {
      path: "home",
      element: <HomeLayout />,
      children: [
        {
          index: true,
          element: <Home />
        },
      ]
    },
    {
      path: "/register",
      element: <Register />
    }
  ])

  return <RouterProvider router={router} />
}

export default App
