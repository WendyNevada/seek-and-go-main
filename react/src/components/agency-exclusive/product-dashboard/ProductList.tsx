import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import AttractionList from './ProductList/AttractionList';
import { urlConstant } from '@/urlConstant';
import VehicleList from './ProductList/VehicleList';
import HotelList from './ProductList/HotelList';
import { useTranslation } from 'react-i18next';
import PackageList from './ProductList/PackageList';

const ProductList = () => {
    const { t } = useTranslation();

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
                <Button onClick={onRoute} className='rounded-full mr-2 mb-2'>{t('Add Attraction')}</Button>
                <Button onClick={onRouteAddVehicle} className='rounded-full mr-2 mb-2'>{t('Add Vehicle')}</Button>
                <Button onClick={onRouteAddHotel} className='rounded-full mr-2 mb-2'>{t('Add Hotel')}</Button>
                <Button onClick={onRouteAddPackage} className='rounded-full mr-2 mb-2'>{t('Add Package')}</Button>
            </div>
            <h1 className='text-3xl font-bold mt-8'>{t('Package List')}</h1>
            <PackageList/>
            <h1 className='text-3xl font-bold mt-8'>{t('Attraction List')}</h1>
            <AttractionList/>
            <h1 className='text-3xl font-bold mt-8'>{t('Vehicle List')}</h1>
            <VehicleList/>
            <h1 className='text-3xl font-bold mt-8'>{t('Hotel List')}</h1>
            <HotelList/>
        </div>
    );
};

export default ProductList
