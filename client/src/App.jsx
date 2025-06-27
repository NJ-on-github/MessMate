import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

//import landing page
import LandingPage from "./components/common/LandingPage.jsx";

//admin
import AdminSidebar from "./components/admin/AdminSidebar.jsx";
import AdminDashboard from "./components/admin/Dashboard.jsx";
import Admin_login from "./components/admin/AdminLogin.jsx";
import Menu from "./components/admin/Menu.jsx";
import PaymentsByMonth from "./components/admin/PaymentsByMonth.jsx";
import StudentPaymentManager from "./components/admin/StudentPaymentManager.jsx";
import All_registrations_list from "./components/admin/AllRegistrationsList.jsx";
import PendingApprovalsList from "./components/admin/PendingApprovalsList.jsx";
import MonthlyFees from "./components/admin/MonthlyFees.jsx";
import Defaulters from "./components/admin/Defaulters.jsx";
import BlockedRegistrations from "./components/admin/BlockedRegistrations.jsx";
import BlockedStudentsList from "./components/admin/BlockedStudentsList.jsx";

//student
import StudentSidebar from "./components/student/StudentSidebar.jsx";
import Student_login_card from "./components/student/StudentLogin.jsx";
import Student_register from "./components/student/StudentRegister.jsx";
import TodaysMenu from "./components/student/TodaysMenu.jsx";
import Student_payments from "./components/student/StudentPayments.jsx";

//Importing ProtectedRoute
import {
  AdminProtectedRoute,
  StudentProtectedRoute,
} from "./components/common/ProtectedRoute.jsx";

//importing css
import "./components/common/common.css";
import "./components/common/table.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />
  },
  {
    path: "/student/login",
    element: (
      <>
        <Student_login_card />
      </>
    ),
  },
  {
    path: "/student/register",
    element: (
      <>
        <Student_register />
      </>
    ),
  },
  {
    path: "/student/dashboard/:studentId",
    element: (
      <StudentProtectedRoute>
        <>
          <StudentSidebar />
          <div className="main-content">
            <TodaysMenu />
          </div>
        </>
      </StudentProtectedRoute>
    ),
  },
  {
    path: "/student/payments/:studentId",
    element: (
      <StudentProtectedRoute>
        <>
          <StudentSidebar />
          <div className="main-content">
            <Student_payments />
          </div>
        </>
      </StudentProtectedRoute>
    ),
  },
  {
    path: "/student/*",
    element: <h1>This page doesn't exist</h1>,
  },
  {
    path: "/admin/login",
    element: <Admin_login />
  },
  {
    path: "/admin/dashboard",
    element: (
      <AdminProtectedRoute>
        <div>
          <AdminSidebar />
          <div className="main-content">
            <AdminDashboard />
          </div>
        </div>
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/registrations",
    element: (
      <AdminProtectedRoute>
        <div>
          <AdminSidebar />
        </div>
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/registrations/pending-approvals",
    element: (
      <AdminProtectedRoute>
        <div>
          <AdminSidebar />
          <div className="main-content">
            <PendingApprovalsList />
          </div>
        </div>
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/registrations/rejected-approvals",
    element: (
      <AdminProtectedRoute>
        <div>
          <AdminSidebar />
          <div className="main-content">
            <BlockedRegistrations />,
          </div>
        </div>
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/payments/update-payments",
    element: (
      <AdminProtectedRoute>
        <AdminSidebar />
        <div className="main-content">
          <StudentPaymentManager />
        </div>
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/payments/defaulters",
    element: (
      <AdminProtectedRoute>
        <div>
          <AdminSidebar />
          <div className="main-content">
            <Defaulters />
          </div>
        </div>
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/payments/payments-by-month",
    element: (
      <AdminProtectedRoute>
        <div>
          <AdminSidebar />
          <div className="main-content">
            <PaymentsByMonth />,
          </div>
        </div>
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/students/all-students",
    element: (
      <AdminProtectedRoute>
        <>
          <AdminSidebar />
          <div className="main-content">
            <All_registrations_list />
          </div>

        </>
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/students/blocked-students",
    element: (
      <AdminProtectedRoute>
        <>
          <AdminSidebar />
          <div className="main-content">
            <BlockedStudentsList />
          </div>
        </>
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/set-fees",
    element: (
      <AdminProtectedRoute>
        <div>
          <AdminSidebar />
          <div className="main-content">
            <MonthlyFees />
          </div>
        </div>
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/Todays-menu",
    element: (
      <AdminProtectedRoute>
        <div>
          <AdminSidebar />
          <div className="main-content">
            <Menu />
          </div>
        </div>
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/*",
    element: (
      <>
        <AdminSidebar />
        <h1>Page doesn't exist</h1>
      </>
    ),
  },
]);

function App() {
  

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
