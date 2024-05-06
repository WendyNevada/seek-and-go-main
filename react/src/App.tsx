import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginRegisterPage from './views/Login-register-page/RegisterPage';
import LoginPage from './views/Login-register-page/LoginPage';
import { LoginProvider } from '@/context/LoginContext';
import AgencyHomePage from './views/Agency-page/AgencyHomePage';
import AgencyProductPage from './views/Agency-page/AgencyProductPage';
import AgencyAddAttractionPage from './views/Agency-page/AgencyAddAttractionPage';
import HomePage from './views/Home-Page/HomePage';
import { useUserRole } from './context/CustomHook';
import AgencyEditAttractionPage from './views/Agency-page/AgencyEditAttractionPage';
import AgencyAddVehiclePage from './views/Agency-page/AgencyAddVehiclePage';
import AgencyEditVehiclePage from './views/Agency-page/AgencyEditVehiclePage';
import AgencyAddHotelPage from './views/Agency-page/AgencyAddHotelPage';
import AgencyEditHotelPage from './views/Agency-page/AgencyEditHotelPage';
import VehicleDetailPage from './views/Customer-page/VehilcleDetailPage';
import { toast } from './components/ui/use-toast';
import AgencyOrderApprovalPage from './views/Agency-page/AgencyOrderApprovalPage';

function App() {
  return (
    <Router>
      <LoginProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Register" element={<LoginRegisterPage />} />
          <Route path="/Login" element={<LoginPage />} />

            {/* Protected Routes for Agency section */}
            <Route path="/Agency/*" element={<AgencyRoutes />} />

            {/* Protected Routes for Customer section */}
            <Route path="/Customer/*" element={<CustomerRoutes />} />

          {/* <Route path="/TEST" element={ <ComboboxDemo/>}/> */}
        </Routes>
      </LoginProvider>
    </Router>
  );
}

// Nested component to handle Agency routes
function AgencyRoutes() {
    const hasAgencyRole = useUserRole('Agency');

    // If user doesn't have the required role, redirect to login
    if (!hasAgencyRole) {
        return <Navigate to="/Login" />;
    }

  return (
    <Routes>
        <Route path="/" element={<AgencyHomePage />} />
        {/* <Route path="DashBoard" element={<AgencyHomePage />} /> */}
        <Route path="Product" element={<AgencyProductPage />} />
        <Route path="AddAttraction" element={<AgencyAddAttractionPage />} />
        <Route path="EditAttraction/:ref_attraction_id" element={<AgencyEditAttractionPage />} />
        <Route path="AddVehicle" element={<AgencyAddVehiclePage />}></Route>
        <Route path="EditVehicle/:ref_vehicle_id" element={<AgencyEditVehiclePage />}></Route>
        <Route path="AddHotel" element={<AgencyAddHotelPage />}></Route>
        <Route path="EditHotel/:ref_hotel_id" element={<AgencyEditHotelPage />}></Route>

        {/* order approval page */}
        <Route path="Approval/:order_h_id" element={<AgencyOrderApprovalPage/>} />
    </Routes>
  );
}


function CustomerRoutes() {
    const hasCustomerRole = useUserRole('Customer');

    // If user doesn't have the required role, redirect to login
    // if (!hasCustomerRole) {
    //     toast({
    //         variant: "destructive",
    //         description: "please Login first"
    //     });
    //     return <Navigate to="/Login" />;
    // }

  return (
    <Routes>
        <Route path="VehicleOrderDetail/:ref_vehicle_id" element={<VehicleDetailPage/>} />

    </Routes>
  );
}

export default App;
