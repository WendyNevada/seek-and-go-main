import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import AttractionList from './ProductList/AttractionList';
import { urlConstant } from '@/urlConstant';
import VehicleList from './ProductList/VehicleList';
import HotelList from './ProductList/HotelList';

const ProductList = () => {
    const navigate = useNavigate();

    const onRoute = () => {
        navigate('/Agency/AddAttraction');
    };

    const onRouteAddVehicle = () => {
        navigate(urlConstant.AddVehicle);
    };

    const onRouteAddHotel = () => {
        navigate(urlConstant.AddHotel);
    }

    const onRouteAddPackage = () => {
        navigate(urlConstant.AddPackage);
    }

    return (
        <div className='mt-20 mx-auto max-w-screen-lg'>
            <div className='flex flex-wrap justify-start mb-4'>
                <Button onClick={onRoute} className='rounded-full mr-2 mb-2'>Add Attraction</Button>
                <Button onClick={onRouteAddVehicle} className='rounded-full mr-2 mb-2'>Add Vehicle</Button>
                <Button onClick={onRouteAddHotel} className='rounded-full mr-2 mb-2'>Add Hotel</Button>
                <Button onClick={onRouteAddPackage} className='rounded-full mr-2 mb-2'>Add Packages</Button>
            </div>
            <h1 className='text-3xl font-bold'>List Attraction</h1>
            <AttractionList/>
            <h1 className='text-3xl font-bold mt-8'>List Vehicle</h1>
            <VehicleList/>
            <h1 className='text-3xl font-bold mt-8'>List Hotel</h1>
            <HotelList/>
        </div>
    );
};

export default ProductList
