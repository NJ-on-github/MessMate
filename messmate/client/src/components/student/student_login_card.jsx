import React from 'react'
import './student_login_card.css'
import '../common/form.css'
// import  '../common.css'

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
            <p className='student_login_card_small_text'>Don't have an account? <a href="/student/register">Register here</a></p>
        </div>
    )
}

export default student_login_card
