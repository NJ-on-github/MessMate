import React from 'react'
import './styles/StudentLoginMessage.css'
import '../common/form.css'

const StudentLoginMessage = (props) => {
  return (
    <div>
      <h2 className='login-message'>{props.message}</h2>
        <p className='login-description'>{props.description}</p>
    </div>
  )
}

export default StudentLoginMessage
