import '@/context/language/i18n';
import { toast } from './components/ui/use-toast';
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
import AgencyOrderApprovalPage from './views/Agency-page/AgencyOrderApprovalPage';
import HotelDetailPage from './views/Customer-page/HotelDetailPage';
import AttractionDetailPage from './views/Customer-page/AttractionDetailPage';
import AgencyAddPackagePage from './views/Agency-page/AgencyAddPackage';
import VehicleOrderDetailPage from './views/Customer-page/Order-page/VehicleOrderDetailPage';
import HotelOrderDetailPage from './views/Customer-page/Order-page/HotelOrderDetailPage';
import ForgotPasswordPage from './views/Forgot-Password-Page/ForgotPasswordPage';
import PaymentPage from './views/Customer-page/Order-page/Payment/PaymentPage';
import AgencyEditPackagePage from './views/Agency-page/AgencyEditPackagePage';
import EditAgencyProfilePage from './views/Profile-Page/EditAgencyProfilePage';
import EditCustomerProfilePage from './views/Profile-Page/EditCustomerProfilePage';

function App() {
  return (
    <Router>
      <LoginProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Register" element={<LoginRegisterPage />} />
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/ForgetPassword/:account_id" element={<ForgotPasswordPage />}></Route>

            {/* Protected Routes for Agency section */}
            <Route path="/Agency/*" element={<AgencyRoutes />} />

            {/* Protected Routes for Customer section */}
            <Route path="/Customer/*" element={<CustomerRoutes />} />
            <Route path="/Customer/VehicleDetail/:ref_vehicle_id" element={<VehicleDetailPage/>} />
            <Route path="/Customer/HotelDetail/:ref_hotel_id" element={<HotelDetailPage/>} />
            <Route path="/Customer/AttractionDetail/:ref_attraction_id" element={<AttractionDetailPage/>} />

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
        <Route path="AddPackage" element={<AgencyAddPackagePage/>}></Route>
        <Route path="EditPackage/:package_h_id" element={<AgencyEditPackagePage/>}></Route>

        {/* order detail page */}
        <Route path="OrderDetail/:order_h_id" element={<AgencyOrderApprovalPage/>} />

        {/* order approval page */}
        <Route path="Approval/:order_h_id" element={<AgencyOrderApprovalPage/>} />

        {/* Edit Profile */}
        <Route path="EditProfileAgency/:account_id" element={<EditAgencyProfilePage/>} />
    </Routes>
  );
}


function CustomerRoutes() {
    const hasCustomerRole = useUserRole('Customer');

    // If user doesn't have the required role, redirect to login
    if (!hasCustomerRole) {
        toast({
            variant: "destructive",
            description: "please Login first"
        });
        return <Navigate to="/Login" />;
    }

  return (
    <Routes>
        <Route path="VehicleOrderDetail/:ref_vehicle_id" element={<VehicleOrderDetailPage/>} />
        <Route path="HoteleOrderDetail/:ref_hotel_id" element={<HotelOrderDetailPage/>} />
        <Route path="PaymentDetail/:order_h_id" element={<PaymentPage/>} />

        {/* Edit Profile */}
        <Route path="EditProfileCustomer/:account_id" element={<EditCustomerProfilePage/>} />
    </Routes>
  );
}

export default App;
