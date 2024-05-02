import React from "react";
import Header from "./Display/Header";
import DisplayVehicle from "./Display/DisplayVehicle";
import DisplayAttraction from "./Display/DisplayAttraction";
import DisplayHotel from "./Display/DisplayHotel";
// import './HomePage.css'
// import Navbar from '../navbar/Navbar'

const Home = () => {
    return (
        <div className="flex flex-col justify-center">
            <Header />
            <div className="mx-80">
                <DisplayVehicle />
                <DisplayAttraction/>
                <DisplayHotel/>
            </div>
        </div>
    );
};

export default Home;
