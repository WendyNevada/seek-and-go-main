import React, { useState } from 'react'
import './LoginRegister.css'

const LoginRegister = () => {
    const [isLogin, setIsLogin] = useState(true);

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className='body'>
            <div className={`container ${isLogin ? '' : 'active'}`} id="container">
                <div className="form-container sign-up">
                    <form>
                        <h1>Create Account</h1>
                        <span>Register as Agency</span>
                        <input type="text" placeholder="Agency Name"/>
                        <input type="email" placeholder="Email"/>
                        <input type="text" placeholder="NPWP"/>
                        <input type="text" placeholder="Lokasi"/>
                        <input type="password" placeholder="Password"/>
                        <button>Register</button>
                    </form>
                    <form action=""></form>
                </div>
                <div className="form-container sign-in">
                    <form action="">
                        <h1>Create Account</h1>
                        <span>Register as Customer</span>
                        <input type="text" placeholder="User Name"/>
                        <input type="email" placeholder="Email"/>
                        <input type="date" placeholder="Tanggal Lahir"/>
                        <input type="text" placeholder="Kelamin" />
                        <input type="text" placeholder="Password" />
                        <button>Register</button>
                    </form>
                </div>
                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h1>Welcome Back!</h1>
                            <p>Enter your personal details to use all of site features</p>
                            <button className="hidden" id="login" onClick={toggleForm}>are you a customer?</button>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <h1>Hello, Friend!</h1>
                            <p>Register with your personal details to use all of site features</p>
                            <button className="hidden" id="register" onClick={toggleForm}>are you an agency?</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginRegister
