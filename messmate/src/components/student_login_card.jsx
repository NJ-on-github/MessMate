import React from 'react'
import './student_login_card.css'
import './form.css'
import  '../common.css'

const student_login_card = () => {
    return (
        <div className='student_login_card'>
            <h2 className='student_login_card_heading'>Log In as Student</h2>
            <form className='student_login_card_form' action="/student_login" method="POST">
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" id="username" required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" required />
                </div>
                <button className='primary-btn' type="submit">Log In</button>
            </form>
        </div>
    )
}

export default student_login_card
