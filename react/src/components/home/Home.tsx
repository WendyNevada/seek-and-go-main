import React from "react";
import Header from "./Display/Header";
import DisplayVehicle from "./Display/DisplayVehicle";
// import './HomePage.css'
// import Navbar from '../navbar/Navbar'

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[40rem]">
            <Header />
            <div className="absolute left-[25rem] mt-[67.5rem]">
                <DisplayVehicle />
            </div>
        </div>
    );
};

export default Home;
