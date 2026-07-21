// App.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "../src/pages/LandingPage";
import Login from "../src/pages/auth/login/Login";
import Register from "../src/pages/auth/register/Register";
import ForgotPassword from "../src/pages/auth/forgetpassword/ForgetPassword";
import VerifyResetCode from "../src/pages/auth/verifyresetcode/VerifyResetCode";
import ResetPassword from "../src/pages/auth/resetpassword/ResetPassword";

import CustomerDashboard from "../src/pages/dashboard/CustomerDashboard/CustomerDashboard";
import TechnicianDashboard from "../src/pages/dashboard/TechnicianDashboard/TechnicianDashboard";
import AdminDashboard from "../src/pages/dashboard/AdminDashboard/AdminDashboard";

//For Admin Dashboard
import AdDashboard from "../src/pages/dashboard/AdminDashboard/admindashboard/AdDashboard";
import Users from "../src/pages/dashboard/AdminDashboard/users/Users";
import Fundis from "../src/pages/dashboard/AdminDashboard/fundis/Fundis";
import AdminBookings from "../src/pages/dashboard/AdminDashboard/bookings/Bookings";
import AdminPayments from "../src/pages/dashboard/AdminDashboard/payments/Payments";
import Reports from "../src/pages/dashboard/AdminDashboard/reports/Reports";
import AdminSettings from "../src/pages/dashboard/AdminDashboard/settings/Settings";

//For Customer Dashboard.
import CusDashboard from "../src/pages/dashboard/CustomerDashboard/cusdashboard/CusDashboard";
import BookService from "../src/pages/dashboard/CustomerDashboard/bookservice/BookService";
import MyBookings from "../src/pages/dashboard/CustomerDashboard/mybookings/MyBookings";
import NearbyTechs from "../src/pages/dashboard/CustomerDashboard/nearbytechs/NearbyTechs";
import CustomerPayments from "../src/pages/dashboard/CustomerDashboard/payments/Payments";
import CustomerNotifications from "../src/pages/dashboard/CustomerDashboard/notifications/Notifications";
import CustomerSettings from "../src/pages/dashboard/CustomerDashboard/settings/Settings";

//For  Technician Dashbord
import TechDashboard from "../src/pages/dashboard/TechnicianDashboard/techdashboard/TechDashboard";
import AvailableJobs from "../src/pages/dashboard/TechnicianDashboard/availablejobs/AvailableJobs";
import MyJobs from "../src/pages/dashboard/TechnicianDashboard/myjobs/MyJobs";
import Earnings from "../src/pages/dashboard/TechnicianDashboard/earnings/Earnings";
import TechNotifications from "../src/pages/dashboard/TechnicianDashboard/notifications/Notifications";
import TechSettings from "../src/pages/dashboard/TechnicianDashboard/settings/Settings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/verify-reset-code",
    element: <VerifyResetCode />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/customer-dashboard",
    element: <CustomerDashboard />,
    children: [
      { path: "", element: <CusDashboard /> },
      { path: "book-service", element: <BookService /> },
      { path: "my-bookings", element: <MyBookings /> },
      { path: "nearby-techs", element: <NearbyTechs /> },
      { path: "payments", element: <CustomerPayments /> },
      { path: "notifications", element: <CustomerNotifications /> },
      { path: "settings", element: <CustomerSettings /> },
    ],
  },
  {
    path: "/technician-dashboard",
    element: <TechnicianDashboard />,
    children: [
      { path: "", element: <TechDashboard /> },
      { path: "techavailablejobs", element: <AvailableJobs /> },
      { path: "techmyjobs", element: <MyJobs /> },
      { path: "techearnings", element: <Earnings /> },
      { path: "technotifications", element: <TechNotifications /> },
      { path: "techsettings", element: <TechSettings /> },
    ],
  },
  {
    path: "/admin-dashboard",
    element: <AdminDashboard />,
    children: [
      { path: "", element: <AdDashboard /> },
      { path: "users", element: <Users /> },
      { path: "fundis", element: <Fundis /> },
      { path: "bookings", element: <AdminBookings /> },
      { path: "payments", element: <AdminPayments /> },
      { path: "reports", element: <Reports /> },
      { path: "settings", element: <AdminSettings /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;