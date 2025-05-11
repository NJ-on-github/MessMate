import React, { useState, useEffect } from 'react'

//import landing page
import Landing_page from './components/common/landing_page.jsx'

// import './App.css'
import PendingPaymentsList from './components/admin/PendingPaymentsList.jsx'
import All from './components/admin/all.jsx'

//admin
import Admin_sidebar from './components/admin/sidebar.jsx'
import Admin_login from './components/admin/AdminLogin.jsx'
import Menu from './components/admin/Menu.jsx'
import StudentPaymentManager from './components/admin/StudentPaymentManager.jsx'
import All_student_list from './components/admin/AllStudentList.jsx'
import PendingApprovalsList from './components/admin/PendingApprovalsList.jsx'

import Monthly_fees from './components/admin/monthly_fees.jsx'
//importing css
import './common.css'
import './components/common/table.css'

//student
import Navbar_basic from './components/student/Navbar.jsx'
import Student_login_card from './components/student/StudentLogin.jsx'
import Student_registration_card from './components/student/StudentRegisterTemp.jsx'
import Student_register from './components/student/StudentRegister.jsx'
import Student_sidebar_temp from './components/student/student_sidebar_temp.jsx'
import Student_login_message from './components/student/StudentLoginMessage.jsx'
import Student_payments from './components/student/StudentPayments.jsx'
import Test from './components/student/test.jsx'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import OverlaySidebar from './components/admin/OverlaySidebar.jsx'
import PushContentSidebar from './components/admin/PushContentSidebar.jsx'
import MonthlyPaymentStatus from './components/admin/MonthlyPaymentStatus.jsx'

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
      <Navbar_basic />
      {/* <Student_sidebar_temp /> */}
      <Student_login_message message="Welcome to the Student Portal" description="Please log in to access your courses and materials." />
      <Student_registration_card />
    </>
  },
  {
    path: "/student/payments/:studentId",
    element: <>
      <Navbar_basic />
      <Student_payments />
    </>
  },
  {
    path: "/test",
    element: <Navbar_basic />,
  },
  {
    path: "/admin",
    element: <>
      {/* <Admin_sidebar/> */}
      <All_student_list />
    </>
  },
  {
    path: "/admin/sidebar",
    element: <>
      {/* <Admin_sidebar /> */}
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
      <Admin_sidebar />
      <All_student_list />
      <Menu />
    </div>
  },
  {
    path: "/admin/registrations",
    element: <div>
      <Admin_sidebar />
    </div>
  },
  {
    path: "/admin/registrations/pending-approvals",
    element: <div>
      <Admin_sidebar />
      <PendingApprovalsList />,
    </div>
  },
  {
    path: "/admin/registrations/rejected-approvals",
    element: <div>
      <Admin_sidebar />
      <PendingApprovalsList />,
    </div>
  },
  {
    path: "/admin/payments/pending-payments",
    element: <div>
      <Admin_sidebar />
      <PendingPaymentsList />,
    </div>
  },
  {
    path: "/admin/payments/update-payments",
    element: <div>
      <Admin_sidebar />
      <StudentPaymentManager />
    </div>
  },
  {
    path: "/admin/payments/defaulters",
    element: <div>
      <Admin_sidebar />
      <MonthlyPaymentStatus />
    </div>
  },
  {
    path: "/admin/students/all-students",
    element: <>
      <Admin_sidebar />
      <All_student_list />
    </>
  },
  {
    path: "/admin/students/blocked-students",
    element: <>
      <Admin_sidebar />
      <All_student_list />
    </>
  },
  {
    path: "/admin/monthly-fees",
    element: <div>
      <Admin_sidebar />
      <Monthly_fees />
    </div>
  },
  {
    path: "/admin/Todays-menu",
    element: <div>
      <Admin_sidebar />
      <Menu />
    </div>
  },
  {
    path: "/admin/*",
    element: <>
    <Admin_sidebar />
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
     


      <PendingPaymentsList />
      <PendingApprovalsList />
      <All />
      <Monthly_fees />
      <Menu />
      <Student_register />



    </>
  )
}

export default App
