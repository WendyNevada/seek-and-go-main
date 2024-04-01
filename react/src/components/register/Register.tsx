import React, { useState } from 'react'
import './Register.css'
import AgencyRegister from './agency-register/AgencyRegister';
import CustomerRegister from './customer-register/CustomerRegister';

const Register = () => {
    const [isLogin, setIsLogin] = useState(true);

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className='body'>
            <div className={`container ${isLogin ? '' : 'active'}`} id="container">
                {/* <AgencyRegisterComponent /> */}
                <AgencyRegister/>
                {/* <CustomerRegisterComponent /> */}
                <CustomerRegister/>
                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h1>Welcome Back!</h1>
                            <p>Enter your personal details to use all of site features</p>
                            <button id="login" onClick={toggleForm}>are you a customer?</button>
                            <span></span>
                            <span>
                                Already have an account?
                                <a href="/Login">
                                    <div className="login-text"> Login</div>
                                </a>
                            </span>

                        </div>
                        <div className="toggle-panel toggle-right">
                            <h1>Hello, Friend!</h1>
                            <p>Register with your personal details to use all of site features</p>
                            <button className="hidden" id="register" onClick={toggleForm}>are you an agency?</button>
                            <span></span>
                            <span>
                                Already have an account?
                                <a href="/Login">
                                    <div className="login-text"> Login</div>
                                </a>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
