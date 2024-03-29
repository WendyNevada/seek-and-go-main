import React, { useState } from 'react'
import './Register.css'
import CustomerRegisterComponent from './customer-register/CustomerRegisterComponent';
import AgencyRegisterComponent from './agency-register/AgencyRegisterComponent';
import AgencyRegister from './agency-register/AgencyRegister';

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
                <CustomerRegisterComponent />
                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h1>Welcome Back!</h1>
                            <p>Enter your personal details to use all of site features</p>
                            <button className="hidden" id="login" onClick={toggleForm}>are you a customer?</button>
                            <span></span>
                            <p>
                                Already have an account?
                                <a href="/Login">
                                    <div className="login-text"> Login</div>
                                </a>
                            </p>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <h1>Hello, Friend!</h1>
                            <p>Register with your personal details to use all of site features</p>
                            <button className="hidden" id="register" onClick={toggleForm}>are you an agency?</button>
                            <span></span>
                            <p>
                                Already have an account?
                                <a href="/Login">
                                    <div className="login-text"> Login</div>
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
