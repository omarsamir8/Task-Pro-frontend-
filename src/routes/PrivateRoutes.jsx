import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const PrivateRoutes = ({ allowedRoles = [] }) => {
  const storedUser = Cookies.get("user");

  const user = storedUser ? JSON.parse(storedUser) : null;

  console.log(user);
  console.log(user?.role);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const userRole = user.role || "member";

  if (!allowedRoles.includes(userRole)) {
    return (
      <Navigate
        to={
          ["admin", "superadmin"].includes(userRole)
            ? "/admin/dashboard"
            : "/user/dashboard"
        }
        replace
      />
    );
  }

  return <Outlet />;
};

export default PrivateRoutes;
