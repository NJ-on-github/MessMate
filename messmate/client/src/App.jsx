import React, { useState, useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

//import landing page
import Landing_page from './components/common/landing_page.jsx'

// import './App.css'
import All from './components/admin/all.jsx'

//admin
import AdminSidebar from './components/admin/AdminSidebar.jsx'
import Admin_login from './components/admin/AdminLogin.jsx'
import Menu from './components/admin/Menu.jsx'
import PaymentsByMonth from './components/admin/PaymentsByMonth.jsx'
import StudentPaymentManager from './components/admin/StudentPaymentManager.jsx'
import All_student_list from './components/admin/AllStudentList.jsx'
import PendingApprovalsList from './components/admin/PendingApprovalsList.jsx'
import Monthly_fees from './components/admin/monthly_fees.jsx'

//student
import StudentNavbar from './components/student/StudentNavbar.jsx'
import Student_login_card from './components/student/StudentLogin.jsx'
import Student_registration_card from './components/student/StudentRegisterTemp.jsx'
import Student_register from './components/student/StudentRegister.jsx'
import TodaysMenu from './components/student/TodaysMenu.jsx'
import Student_sidebar_temp from './components/student/student_sidebar_temp.jsx'
import Student_login_message from './components/student/StudentLoginMessage.jsx'
import Student_payments from './components/student/StudentPayments.jsx'
import Test from './components/student/test.jsx'

import OverlaySidebar from './components/admin/OverlaySidebar.jsx'
import PushContentSidebar from './components/admin/PushContentSidebar.jsx'
import MonthlyPaymentStatus from './components/admin/MonthlyPaymentStatus.jsx'

//importing css
import './components/common/common.css'
import './components/common/table.css'
import BlockedRegistrations from './components/admin/BlockedRegistrations.jsx'
import BlockedStudentsList from './components/admin/BlockedStudentsList.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing_page />,
  },
  {
    path: "/student/login",
    element: <>
      <Student_login_card />
    </>
  },
  {
    path: "/student/register",
    element: <>
      <Student_register />
    </>
  },
  {
    path: "/student/dashboard/:studentId",
    element: <>
      <Test />
      <StudentNavbar />
      <TodaysMenu />
    </>
  },
  {
    path: "/student/payments/:studentId",
    element: <>
      <StudentNavbar />
      <Student_payments />
    </>
  },
  {
    path: "/test",
    element: <StudentNavbar />,
  },
  {
    path: "/admin",
    element: <>
      {/* <AdminSidebar/> */}
      <All_student_list />
    </>
  },
  {
    path: "/admin/sidebar",
    element: <>
      {/* <AdminSidebar /> */}
      <OverlaySidebar />
    </>
  },
  {
    path: "/admin/push-sidebar",
    element: <>
      <PushContentSidebar />
    </>
  },
  {
    path: "/admin/login",
    element: <Admin_login />,
  },
  {
    path: "/admin/dashboard",
    element: <div>
      <AdminSidebar />
      <All_student_list />
      <Menu />
    </div>
  },
  {
    path: "/admin/registrations",
    element: <div>
      <AdminSidebar />
    </div>
  },
  {
    path: "/admin/registrations/pending-approvals",
    element: <div>
      <AdminSidebar />
      <div className="main-content">
        <PendingApprovalsList />,
      </div>
    </div>
  },
  {
    path: "/admin/registrations/rejected-approvals",
    element: <div>
      <AdminSidebar />
      <div className="main-content">
        <BlockedRegistrations />,
      <PendingApprovalsList />,
      </div>
    </div>
  },
  {
    path: "/admin/payments/payments-by-month",
    element: <div>
      <AdminSidebar />
      <div className="main-content">
      <PaymentsByMonth />,
      </div>
    </div>
  },
  {
    path: "/admin/payments/update-payments",
    element: <div>
      <AdminSidebar />
      <StudentPaymentManager />
    </div>
  },
  {
    path: "/admin/payments/defaulters",
    element: <div>
      <AdminSidebar />
      <MonthlyPaymentStatus />
    </div>
  },
  {
    path: "/admin/students/all-students",
    element: <>
      <AdminSidebar />
      <All_student_list />
    </>
  },
  {
    path: "/admin/students/blocked-students",
    element: <>
      <AdminSidebar />
      <BlockedStudentsList />
      <All_student_list />
    </>
  },
  {
    path: "/admin/monthly-fees",
    element: <div>
      <AdminSidebar />
      <Monthly_fees />
    </div>
  },
  {
    path: "/admin/Todays-menu",
    element: <div>
      <AdminSidebar />
      <Menu />
    </div>
  },
  {
    path: "/admin/*",
    element: <>
      <AdminSidebar />
      <h1>Page doesn't exist</h1>
    </>
  }
]);

function App() {

  useEffect(() => {
    async function fetchStudents() {
      const res = await fetch('http://localhost:3000/admin/students');
      console.log(res.ok)
      console.log(await res.json())
      console.log("App over")
    }

    fetchStudents();
  }, [])

  return (
    <>
      <RouterProvider router={router} />


      <h1>App</h1>
      <All />

      {/* <OverlaySidebar /> */}

      {/* <PaymentsByMonth />
      <PendingApprovalsList />
      <All />
      <Monthly_fees />
      <Menu />
      <Student_register /> */}



    </>
  )
}

export default App
