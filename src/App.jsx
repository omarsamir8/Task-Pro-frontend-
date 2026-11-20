import { BrowserRouter as Router, Navigate, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import ForgetPassword from "./pages/Auth/ForgetPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

import MyTasks from "./pages/User/MyTasks";
import ViewTaskDetails from "./pages/User/ViewTaskDetails";
import UserLayout from "./components/user/UserLayout";

import Dashboard from "./pages/Admin/Dashboard";

import PrivateRoutes from "./routes/PrivateRoutes";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Admin Routes */}
        <Route element={<PrivateRoutes allowedRoles={["admin", "superadmin"]} />}>
          <Route path="/admin/users" element={<Dashboard />} />
          <Route path="/admin/users/:id" element={<Dashboard />} />
          <Route path="/admin/reports" element={<Dashboard />} />
          <Route path="/admin/settings" element={<Dashboard />} />
          <Route path="/admin/create-task" element={<Dashboard />} />
          <Route path="/admin/tasks/:id/edit" element={<Dashboard />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/tasks" element={<Dashboard />} />
          <Route path="/admin/tasks/:id" element={<Dashboard />} />
          <Route path="/admin/users/:id/edit" element={<Dashboard />} />
          <Route path="/admin/users/new" element={<Dashboard />} />
        </Route>

        {/* User Routes */}
        <Route element={<PrivateRoutes allowedRoles={["member"]} />}>
          <Route element={<UserLayout />}>
            <Route path="/user/dashboard" element={<Navigate to="/user/tasks" replace />} />
            <Route path="/user/tasks" element={<MyTasks />} />
            <Route path="/user/task-details/:id" element={<ViewTaskDetails />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
