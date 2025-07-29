import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout"; // This will be for the Home page
import DashboardLayout from "../layouts/DashboardLayout"; // This is for dashboard pages
import ErrorPage from "../pages/Shared/ErrorPage.jsx";

// Home & Auth Pages
import BestWorkers from "../pages/Home/BestWorkers";
import Testimonials from "../pages/Home/Testimonials";
import SectionOne from "../pages/Home/Extras/SectionOne";
import SectionTwo from "../pages/Home/Extras/SectionTwo";
import SectionThree from "../pages/Home/Extras/SectionThree";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Home from "../pages/Home/Home.jsx"; // Home for MainLayout

// Dashboard Pages
import BuyerHome from "../pages/Dashboard/Buyer/BuyerHome";
import AddTask from "../pages/Dashboard/Buyer/AddTask";
import MyTasks from "../pages/Dashboard/Buyer/MyTasks";
import PaymentHistory from "../pages/Dashboard/Buyer/PaymentHistory";
import PurchaseCoin from "../pages/Dashboard/Buyer/PurchaseCoin";
import ReviewSubmissions from "../pages/Dashboard/Buyer/ReviewSubmissions";
import WorkerHome from "../pages/Dashboard/Worker/WorkerHome";
import MySubmissions from "../pages/Dashboard/Worker/MySubmissions";
import TaskDetails from "../pages/Dashboard/Worker/TaskDetails";
import TaskList from "../pages/Dashboard/Worker/TaskList";
import Withdrawals from "../pages/Dashboard/Worker/Withdrawals";
import AdminHome from "../pages/Dashboard/Admin/AdminHome";
import ManageTasks from "../pages/Dashboard/Admin/ManageTasks";
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers";
import WithdrawRequests from "../pages/Dashboard/Admin/WithdrawRequests";

// Shared Pages
import Forbidden from "../pages/Shared/Forbidden";
import Loading from "../pages/Shared/Loading";

// Router Setup
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // Use MainLayout for the Home page
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Home /> }, // Main Home Page
      { path: "best-workers", element: <BestWorkers /> },
      { path: "testimonials", element: <Testimonials /> },
      { path: "section-one", element: <SectionOne /> },
      { path: "section-two", element: <SectionTwo /> },
      { path: "section-three", element: <SectionThree /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />, // Use DashboardLayout here for authenticated routes
    children: [
      // Buyer Routes
      { path: "/dashboard/buyer-home", element: <BuyerHome /> },
      { path: "/dashboard/add-task", element: <AddTask /> },
      { path: "/dashboard/my-tasks", element: <MyTasks /> },
      { path: "/dashboard/buyer/payment-history", element: <PaymentHistory /> },
      { path: "/dashboard/purchase-coin", element: <PurchaseCoin /> },
      { path: "/dashboard/review-submissions", element: <ReviewSubmissions /> },

      // Worker Routes
      { path: "/dashboard/worker-home", element: <WorkerHome /> },
      { path: "/dashboard/worker/my-submissions", element: <MySubmissions /> },
      { path: "/dashboard/task-details/:id", element: <TaskDetails /> },
      { path: "/dashboard/task-list", element: <TaskList /> },
      { path: "/dashboard/withdrawals", element: <Withdrawals /> },

      // Admin Routes
      { path: "/dashboard/admin-home", element: <AdminHome /> },
      { path: "/dashboard/manage-tasks", element: <ManageTasks /> },
      { path: "/dashboard/manage-users", element: <ManageUsers /> },
      { path: "/dashboard/withdraw-requests", element: <WithdrawRequests /> },
    ],
  },
  { path: "/forbidden", element: <Forbidden /> },
  { path: "/loading", element: <Loading /> },
]);

export default router;
