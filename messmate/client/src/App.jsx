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
import Menu from './components/admin/menu.jsx'

//importing css
import './common.css'
import './components/common/table.css'


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
      <h1>App</h1>
      {/* <h3>{res}</h3> */}
      {/*   
      <Student_registration_card/>
      <Student_login_card/>
      <Student_login_card/>
      <Student_login_message message="Welcome to the Student Portal" description="Please log in to access your courses and materials."/> */}

     
      <All_student_list/>
      <PendingPaymentsList/>
      <PendingApprovalsList/>
      <All/>
      <Monthly_fees/>
      <Menu/>

      {/* const result=  */}

    </>
  )
}

export default App
