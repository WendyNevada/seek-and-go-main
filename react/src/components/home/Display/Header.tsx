import { assetForWeb } from "@/assets/assetStatic";
import { TypewriterEffect } from "@/components/ui/AceTernity/typewriter-effect";
import React from "react";

const Header = () => {
    const words = [
        {
            text: "Welcome",
        },
        {
            text: "To",
        },
        {
            text: "Seek",
        },
        {
            text: "&",
        },
        {
            text: "Go.",
            className: "text-white dark:text-white-500",
        },
    ];

    return (
        <div
            className="bg-cover bg-center mt-[3.5rem] absolute inset-0 place-content-center"
            style={{ height: "40rem" }}
        >
            <TypewriterEffect words={words} />
            <div
                className="bg-cover bg-center absolute inset-0 place-content-center"
                style={{
                    backgroundImage: `url(${assetForWeb.HomePageBackground})`,
                    height: "100%",
                    zIndex: -50,
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50"></div>
            </div>
        </div>
    );
};

export default Header;
