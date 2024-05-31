import Header from "./Display/Header";
import DisplayVehicle from "./Display/DisplayVehicle";
import DisplayAttraction from "./Display/DisplayAttraction";
import DisplayHotel from "./Display/DisplayHotel";
import DisplayPackage from "./Display/DisplayPackage";
// import './HomePage.css'
// import Navbar from '../navbar/Navbar'

const Home = () => {
    return (
        <div className="flex flex-col justify-center items-center">
            <Header />
            <div className="w-[20rem] md:w-[40rem] lg:w-[80rem]">
                <DisplayPackage/>
                <DisplayVehicle />
                <DisplayAttraction />
                <DisplayHotel />
            </div>
        </div>
    );
};

export default Home;
