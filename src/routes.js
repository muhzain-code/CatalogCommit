// routes.js
import Layout from "./Pages/Layout"
import Home from "./Pages/Home"
import Wishlist from "./Pages/Wishlist"
import Cart from "./Pages/Cart"
import Checkout from "./Pages/Checkout"
import Payment from "./Pages/Payment"
import Contact from "./Pages/Contact"
import Account from "./Pages/Account"
import About from "./Pages/About"
import SignUp from "./Pages/CekResi"
import LogIn from "./Pages/LogIn"
import Product from "./Pages/Product"
import AllProducts from "./Pages/AllProducts"
import NotFound from "./Pages/NotFound"
import Category from "./Pages/Category"
import UMKMDetail from "./Pages/UmkmDetail"
import EventDetail from "./Pages/EventDetail"

// Import Admin Components
import AdminLayout from "./Pages/Admin/AdminLayout"
import AdminDashboard from "./Pages/Admin/AdminDashboard"
import AdminProducts from "./Pages/Admin/AdminProducts"
import AdminUMKM from "./Pages/Admin/AdminUMKM"
import AdminCategories from "./Pages/Admin/AdminCategories"
import AdminEventUMKM from "./Pages/Admin/AdminEventUMKM"
import AdminEvents from "./Pages/Admin/AdminEvents"
import AdminPromoProducts from "./Pages/Admin/AdminPromoProducts"
import AdminBrands from "./Pages/Admin/AdminApplications"
import Forgot from "./Pages/Forgot"

const routes = [
  {
    path: "/",
    element: Layout,
    children: [
      { path: "", element: Home },
      { path: "contact", element: Contact },
      { path: "account", element: Account },
      { path: "about", element: About },
      { path: "cek-resi", element: SignUp },
      { path: "login", element: LogIn },
      { path: "forgot", element: Forgot },
      { path: "wishlist", element: Wishlist },
      { path: "cart", element: Cart },
      { path: "checkout", element: Checkout },
      { path: "payment", element: Payment },
      { path: "allProducts", element: AllProducts },
      { path: "category", element: Category },
      { path: "allProducts/:productId", element: Product },
      { path: "umkm/:umkmId", element: UMKMDetail },
      { path: "event/:eventId", element: EventDetail },
      { path: "*", element: NotFound },
    ],
  },
  // Admin Routes - Separate from main layout
  {
    path: "/admin",
    element: AdminLayout,
    children: [
      { path: "", element: AdminDashboard },
      { path: "products", element: AdminProducts },
      { path: "applications", element: AdminBrands },
      { path: "umkm", element: AdminUMKM },
      { path: "categories", element: AdminCategories },
      { path: "event-umkm", element: AdminEventUMKM },
      { path: "events", element: AdminEvents },
      { path: "promo-products", element: AdminPromoProducts },
    ],
  },
]

export default routes
