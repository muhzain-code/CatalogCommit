// components/RouteListener.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const RouteListener = () => {
  const location = useLocation();

  useEffect(() => {
    const isAdminRoute = location.pathname.startsWith("/admin");

    if (!isAdminRoute) {
      Cookies.remove("token");
      Cookies.remove("name");
      Cookies.remove("email");
    }
  }, [location]);

  return null; // Komponen ini hanya untuk efek samping
};

export default RouteListener;
