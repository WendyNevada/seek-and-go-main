// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginRegisterPage from './views/Login-register-page/RegisterPage';
import LoginPage from './views/Login-register-page/LoginPage';
import { LoginProvider } from '@/context/LoginContext';
import AgencyHomePage from './views/Agency-page/AgencyHomePage';
import AgencyProductPage from './views/Agency-page/AgencyProductPage';
import AgencyAddProductPage from './views/Agency-page/AgencyAddProductPage';
import HomePage from './views/Home-Page/HomePage';
// import { ComboboxDemo } from './components/agency-exclusive/add-product/ComboBox.tsx/ZipCodeCombobox';

function App() {
  return (
    <Router>
      <LoginProvider>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/Register" element={<LoginRegisterPage />} />
            <Route path="/Login" element={<LoginPage />} />
            {/* <ProtectedRoute path="/Agency" element={<LoginPage />} requiredRole="Agency" /> */}
            {/* <Route
                path='/Agency'
                element={<ProtectedRoute element={<AgencyHomePage />} requiredRole="Agency" path={'/Agency'} />}
            /> */}

            {/*ngga pake role*/}
            <Route path="/Agency/DashBoard" element={<AgencyHomePage />}/>
            <Route path="/Agency/Product" element={<AgencyProductPage />}/>
            <Route path="/Agency/AddProduct" element={<AgencyAddProductPage />}/>

            {/* <Route path="/TEST" element={ <ComboboxDemo/>}/> */}
        </Routes>
      </LoginProvider>
    </Router>
  );
}

export default App;
