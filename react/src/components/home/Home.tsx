import React from "react";
import Header from "./Display/Header";
import DisplayVehicle from "./Display/DisplayVehicle";
import DisplayAttraction from "./Display/DisplayAttraction";
import DisplayHotel from "./Display/DisplayHotel";
// import './HomePage.css'
// import Navbar from '../navbar/Navbar'

const Home = () => {
    return (
        <div className="flex flex-col justify-center items-center">
            <Header />
            <div className="w-[20rem] md:w-[40rem] lg:w-[80rem]">
                <DisplayVehicle />
                <DisplayAttraction />
                <DisplayHotel />
            </div>
        </div>
    );
};

export default Home;
