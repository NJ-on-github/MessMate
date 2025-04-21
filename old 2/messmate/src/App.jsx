// import './App.css'
import React from 'react'
import Student_login_card from './components/student_login_card.jsx'
import Student_login_message from './components/student_login_message.jsx'

function App() {
  return (
    <>
      <Student_login_card/>
      <Student_login_card/>
      <Student_login_message message="Welcome to the Student Portal" description="Please log in to access your courses and materials."/>
    </>
  )
}

export default App
