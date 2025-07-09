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
import SignUp from "./Pages/SignUp"
import LogIn from "./Pages/LogIn"
import Product from "./Pages/Product"
import AllProducts from "./Pages/AllProducts"
import NotFound from "./Pages/NotFound"
import Category from "./Pages/Category"

// Import Admin Components
import AdminLayout from "./Pages/Admin/AdminLayout"
import AdminDashboard from "./Pages/Admin/AdminDashboard"
import AdminProducts from "./Pages/Admin/AdminProducts"
import AdminBrands from "./Pages/Admin/AdminBrand"
import AdminUMKM from "./Pages/Admin/AdminUMKM"
import AdminCategories from "./Pages/Admin/AdminCategories"
import AdminPhysicalNews from "./Pages/Admin/AdminPhysicalNews"
import AdminPromoNews from "./Pages/Admin/AdminPromoNews"
import AdminPromoProducts from "./Pages/Admin/AdminPromoProducts"

const routes = [
  {
    path: "/",
    element: Layout,
    children: [
      { path: "", element: Home },
      { path: "contact", element: Contact },
      { path: "account", element: Account },
      { path: "about", element: About },
      { path: "signup", element: SignUp },
      { path: "login", element: LogIn },
      { path: "wishlist", element: Wishlist },
      { path: "cart", element: Cart },
      { path: "checkout", element: Checkout },
      { path: "payment", element: Payment },
      { path: "allProducts", element: AllProducts },
      { path: "category", element: Category },
      { path: "allProducts/:title", element: Product },
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
      { path: "brands", element: AdminBrands },
      { path: "umkm", element: AdminUMKM },
      { path: "categories", element: AdminCategories },
      { path: "physical-news", element: AdminPhysicalNews },
      { path: "promo-news", element: AdminPromoNews },
      { path: "promo-products", element: AdminPromoProducts },
    ],
  },
]

export default routes
