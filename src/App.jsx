import './App.css'
import './index.css'
import Home from './pages/Home'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import HomeLayout from './layouts/HomeLayout'
import Register from './features/auth/Register'
import Onboarding from './pages/Onboarding'
import MainLayout from './layouts/MainLayout'
import ShopPage from './pages/Shop'

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Onboarding />,
    },
    {
      
      element: <MainLayout />,
      children: [
        {
          path: "/home",
          element: <HomeLayout />,
          children: [
            {
              index: true,
              element: <Home />,
            },
            ],
        },
        {
          path: "/shop",
          element: <ShopPage />,
        },
        
      ],
    },
    
    {
      path: "/register",
      element: <Register />,
    },
  ])

  return <RouterProvider router={router} />
}

export default App
