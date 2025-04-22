import React from 'react'
import './student_register_card.css'
import './form.css'
import  '../common.css'

const student_register_card = () => {
  return (
    <div>
      <form action="post">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" name="name" id="name" required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" required />
        </div>
        <div className="form-group">
          <label htmlFor="hostel_name">Hostel Name</label>
          <input type="text" name="hostel_name" id="hostel_name" required />
        </div>
        <div className="form-group">
          <label htmlFor="branch">Branch</label>
          <input type="text" name="branch" id="branch" required />
        </div>
        <button className='primary-btn' type="submit">Register</button>
      </form>
    </div>
  )
}

export default student_register_card
