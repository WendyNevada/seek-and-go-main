import { assetForWeb } from "@/assets/assetStatic";
import { TypewriterEffect } from "@/components/ui/AceTernity/typewriter-effect";
import SearchComponent from "@/components/ui/Custom/search";
import { useTranslation } from 'react-i18next';

const Header = () => {
    const { t } = useTranslation();

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
        <div className="relative mt-[2rem] w-full">
            {/* Background with typewriter effect */}
            <div
                className="bg-cover bg-center inset-0 flex items-center justify-center flex-col"
                style={{ height: "40rem", zIndex: 10, backgroundImage: `url(${assetForWeb.HomePageBackground})`, backgroundSize: "cover",}}
            >
                <TypewriterEffect words={words} className="z-40"/>
                <br></br>
                <div className="z-40 text-white dark:text-white-500 text-7xl font-semibold">{t('greeting')}</div>
                <SearchComponent className="mt-6 z-40 w-1/3"/>
            </div>
            {/* Background image */}
            <div
                className="bg-cover bg-center inset-0 "
                style={{
                    zIndex: -50,
                }}
            >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50"></div>
            </div>
        </div>
    );
};

export default Header;
