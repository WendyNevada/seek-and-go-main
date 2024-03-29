import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import React, { useState } from 'react'

interface InputValues {
    agencyName: string;
    email: string;
    npwp: string;
    location: string;
    password: string;
    rePassword: string;
}

const AgencyRegisterComponent = () => {
    const [agencyRegister, setAgencyRegister] = useState({
        agencyName: '',
        email: '',
        npwp: '',
        location: '',
        password: '',
        rePassword: ''
    });


    const validateValues = (inputValues: InputValues) => {
        const errors: { password?: string, rePassword?: string} = {};
        if (inputValues.password.length < 8) {
            errors.password = "Password is too short";
            console.log(errors.password);
            alert(errors.password);
        }
        if (inputValues.rePassword.length < 8) {
            errors.rePassword = "rePassword is too short";
            console.log(errors.rePassword);
        }
        return errors;
    };

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validationErrors = validateValues(agencyRegister);
        if(agencyRegister.password.length < 8){
            validationErrors.password = "Password is too short";
        }
        // setAgencyRegister({ ...agencyRegister, [e.target.name]: e.target.value });
        setErrors(validationErrors);
    };

    const handleForm = (e:any) => {
        const {name: inputName, value: inputValue} = e.target;
        setAgencyRegister({...agencyRegister, [inputName]: inputValue})
    }

  return (
    <div>
        <div className="form-container sign-up">
            {/* <form onSubmit={handleSubmit}>
                <h1>As Agency</h1>
                <input type="text" name="agencyName" placeholder="Agency Name" required/>
                <input type="email" name="email" placeholder="Email"/>
                <input type="text" name='npwp' placeholder="NPWP"/>
                <input type="text" name='location' placeholder="Lokasi"/>
                <input type="password" name='password' placeholder="Password" onChange={handleForm} value={agencyRegister.password}/>
                {<span>{errors.password}</span>}
                <input type="password" name='rePassword' placeholder="Confirm Password" onChange={(e) => setAgencyRegister({...agencyRegister, rePassword: e.target.value})}/>
                <button type='submit'>Register</button>
            </form> */}
        </div>
    </div>
  )
}

export default AgencyRegisterComponent
