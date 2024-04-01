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
                            <span>Enter your personal details to use all of site features</span>
                            <button className="hidden" id="login" onClick={toggleForm}>are you a customer?</button>
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
                            <span>Register with your personal details to use all of site features</span>
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
