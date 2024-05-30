import { useState } from 'react'
// import './Register.css'
import CustomerRegisterComponent from './customer-register/CustomerRegister';
import AgencyRegisterComponent from './agency-register/AgencyRegister';
import { Button } from '../ui/button';
import { useTranslation } from 'react-i18next';

const Register = () => {
    const { t } = useTranslation();

    const [isRegisCustomer, setisRegisCustomer] = useState(true);

    const toggleForm = () => {
        setisRegisCustomer(!isRegisCustomer);
    };

    return (
        <div className='none mt-20'>
            <div id="container" className="bg-gray-100 p-0 sm:p-12">
                {/* <AgencyRegisterComponent></AgencyRegisterComponent> */}
                <div className='justify-center flex'>
                    {isRegisCustomer ? <Button onClick={toggleForm}>{t('Register as Agency?')}</Button> : <Button onClick={toggleForm}>{t('Register as Customer?')}</Button>}
                </div>
                {isRegisCustomer ? <CustomerRegisterComponent/> : <AgencyRegisterComponent/>}

                {/* <div className="toggle-container">
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
                </div> */}
            </div>
        </div>
    )
}

export default Register
