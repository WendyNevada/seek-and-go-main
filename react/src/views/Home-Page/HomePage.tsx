import Home from "@/components/home/Home";
import Footer from "@/components/navbar/Footer";
import Navbar from "@/components/navbar/Navbar";

const HomePage = () => {
    return (
        <div>
            <Navbar/>
            <div className="mt-[3.5rem]">
                <Home />
            </div>
            <Footer/>
        </div>
    );
};

export default HomePage;
