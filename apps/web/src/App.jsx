import './App.css'
import './index.css'
import Home from './pages/Home'
import { useEffect } from 'react'
import { RouterProvider, createBrowserRouter, Outlet, useLocation, useNavigationType } from 'react-router-dom'
import HomeLayout from './layouts/HomeLayout'
import Register from './features/auth/Register'
import Onboarding from './pages/Onboarding'
import MainLayout from './layouts/MainLayout'
import VendorLayout from './layouts/VendorLayout'
import ShopPage from './pages/Shop'
import ProductDetailPage from './pages/ProductDetail'
import CartPage from './pages/Cart'
import WishlistPage from './pages/Wishlist'
import CheckoutAddressPage from './pages/CheckoutAddress'
import CheckoutShippingPage from './pages/CheckoutShipping'
import CheckoutPaymentPage from './pages/CheckoutPayment'
import CheckoutReviewPage from './pages/CheckoutReview'
import CheckoutConfirmationPage from './pages/CheckoutConfirmation'
import OrdersPage from './pages/Orders'
import OrderDetailPage from './pages/OrderDetail'
import VendorApplyPage from './pages/VendorApply'
import VendorDashboardPage from './pages/VendorDashboard'
import VendorProductsPage from './pages/VendorProducts'
import VendorOrdersPage from './pages/VendorOrders'
import VendorCouponsPage from './pages/VendorCoupons'
import VendorPayoutsPage from './pages/VendorPayouts'
import VendorSettingsPage from './pages/VendorSettings'
import VendorStorefrontPage from './pages/VendorStorefront'
import ScrollToTop from './reusableComponents/ScrollToTop'
import ToastHost from './reusableComponents/ToastHost'

const RouteUrlSync = () => {
  const location = useLocation()
  const navigationType = useNavigationType()

  useEffect(() => {
    const nextUrl = `${location.pathname}${location.search}${location.hash}`
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`

    if (currentUrl === nextUrl) return

    if (navigationType === "PUSH") {
      window.history.pushState(window.history.state, "", nextUrl)
      return
    }

    window.history.replaceState(window.history.state, "", nextUrl)
  }, [location, navigationType])

  return null
}

const RootShell = () => (
  <>
    <RouteUrlSync />
    <ScrollToTop />
    <Outlet />
  </>
)

const router = createBrowserRouter([
  {
    element: <RootShell />,
    children: [
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
          {
            path: "/products/:slug",
            element: <ProductDetailPage />,
          },
          {
            path: "/cart",
            element: <CartPage />,
          },
          {
            path: "/wishlist",
            element: <WishlistPage />,
          },
          {
            path: "/checkout/address",
            element: <CheckoutAddressPage />,
          },
          {
            path: "/checkout/shipping",
            element: <CheckoutShippingPage />,
          },
          {
            path: "/checkout/payment",
            element: <CheckoutPaymentPage />,
          },
          {
            path: "/checkout/review",
            element: <CheckoutReviewPage />,
          },
          {
            path: "/checkout/confirmation/:id",
            element: <CheckoutConfirmationPage />,
          },
          {
            path: "/orders",
            element: <OrdersPage />,
          },
          {
            path: "/orders/:id",
            element: <OrderDetailPage />,
          },
          {
            path: "/vendor/apply",
            element: <VendorApplyPage />,
          },
          {
            path: "/vendors/:slug",
            element: <VendorStorefrontPage />,
          },
          {
            path: "/vendor",
            element: <VendorLayout />,
            children: [
              {
                index: true,
                element: <VendorDashboardPage />,
              },
              {
                path: "products",
                element: <VendorProductsPage />,
              },
              {
                path: "orders",
                element: <VendorOrdersPage />,
              },
              {
                path: "coupons",
                element: <VendorCouponsPage />,
              },
              {
                path: "payouts",
                element: <VendorPayoutsPage />,
              },
              {
                path: "settings",
                element: <VendorSettingsPage />,
              },
            ],
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
    ],
  },
])

function App() {
  return (
    <div className="mx-auto w-full max-w-[430px] min-h-svh bg-white shadow-xl shadow-black/10">
      <RouterProvider router={router} />
      <ToastHost />
    </div>
  )
}

export default App
