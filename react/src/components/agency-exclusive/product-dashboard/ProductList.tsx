import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import AttractionList from './AttractionList/AttractionList';

const ProductList = () => {
    const navigate = useNavigate();

    const onRoute = () => {
        navigate('/Agency/AddAttraction');
    };

    return (
        <div className='mt-20 mx-auto max-w-screen-lg'>
            <div className='flex flex-wrap justify-start mb-4'>
                <Button onClick={onRoute} className='rounded-full mr-2 mb-2'>Add Attraction</Button>
                <Button className='rounded-full mr-2 mb-2'>Add Vehicle</Button>
                <Button className='rounded-full mr-2 mb-2'>Add Hotel</Button>
                <Button className='rounded-full mr-2 mb-2'>Add Packages</Button>
            </div>
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"> */}
            <h1 className='text-3xl font-bold'>List Attraction</h1>
            <AttractionList/>
            {/* </div> */}
            {/* ProductList */}
        </div>
    );
};

export default ProductList
