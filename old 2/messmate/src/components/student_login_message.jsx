import React from 'react'
import './student_login_message.css'
import  '../common.css'

const student_login_message = (props) => {
  return (
    <div>
      <h2 className='login-message'>{props.message}</h2>
        <p className='login-description'>{props.description}</p>
    </div>
  )
}

export default student_login_message
