import './App.css'
import './index.css'
import Home from './pages/Home'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import HomeLayout from './layouts/HomeLayout'
import Register from './features/auth/Register'
import Onboarding from './pages/Onboarding'
import MainLayout from './layouts/MainLayout'
import ShopPage from './pages/Shop'
import ToastHost from './reusableComponents/ToastHost'

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
      element: <Register mode="register" />,
    },
    {
      path: "/login",
      element: <Register mode="login" />,
    },
  ])

  return (
    <div className="mx-auto w-full max-w-[430px] min-h-svh bg-white shadow-xl shadow-black/10">
      <RouterProvider router={router} />
      <ToastHost />
    </div>
  )
}

export default App
