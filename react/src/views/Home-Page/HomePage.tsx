import Home from "@/components/home/Home";
import Navbar from "@/components/navbar/Navbar";
import React from "react";

const HomePage = () => {
    return (
        <div>
            <Navbar />
            <div className="mt-[3.5rem]">
                <Home />
            </div>
        </div>
    );
};

export default HomePage;
