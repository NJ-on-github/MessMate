//import landing page
import Landing_page from './components/common/landing_page.jsx'

// import './App.css'
import React, { useState, useEffect } from 'react'
import Student_login_card from './components/student/student_login_card.jsx'
import Student_login_message from './components/student/student_login_message.jsx'
import Student_registration_card from './components/student/student_register_card.jsx'
import All_student_list from './components/admin/all_student_list.jsx'
import PendingPaymentsList from './components/admin/pending_payments_list.jsx'
import PendingApprovalsList from './components/admin/pending_approvals_list.jsx'
import All from './components/admin/all.jsx'
import Monthly_fees from './components/admin/monthly_fees.jsx'

//admin
import Admin_sidebar from './components/admin/sidebar.jsx'
import Admin_login from './components/admin/admin_login.jsx'
import Menu from './components/admin/menu.jsx'


//importing css
import './common.css'
import './components/common/table.css'

//student
import Student_register from './components/student/student_register.jsx'
import Student_sidebar_temp from './components/student/student_sidebar_temp.jsx'
import Navbar_basic from './components/student/navbar_basic.jsx'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

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
    path: "/student/dashboard",
    element: <>
      <Navbar_basic />
      <Student_sidebar_temp />
      <Student_login_message message="Welcome to the Student Portal" description="Please log in to access your courses and materials." />
      <Student_registration_card />
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
    path: "/admin/pending-payments",
    element: <div>
      <Admin_sidebar />
      <PendingPaymentsList />,
    </div>
  },
  {
    path: "/admin/pending-approvals",
    element: <div>
      <Admin_sidebar />
      <PendingApprovalsList />,
    </div>
  },
  {
    path: "/admin/defaulters",
    element: <div>
      <Admin_sidebar />
      <All_student_list />
    </div>
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
      {/* <Student_sidebar_temp/> */}
      {/* <Navbar_Basic/> */}

      <h1>App</h1>
      {/* <h3>{res}</h3> */}
      {/*   
      <Student_registration_card/>
      <Student_login_card/>
      <Student_login_card/>
      <Student_login_message message="Welcome to the Student Portal" description="Please log in to access your courses and materials."/> */}


      <All_student_list />
      <PendingPaymentsList />
      <PendingApprovalsList />
      <All />
      <Monthly_fees />
      <Menu />
      <Student_register />


      {/* const result=  */}

    </>
  )
}

export default App
