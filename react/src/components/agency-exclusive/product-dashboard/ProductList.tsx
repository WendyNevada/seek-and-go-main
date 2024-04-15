import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
    const navigate = useNavigate();

    const onRoute = () => {
        navigate('/Agency/AddProduct');
    }

    return (
        <div>
            <div className='flex justify-end'>
                <Button onClick={onRoute} className='mt-4 rounded-full mr-4'>Add Attraction</Button>
                <Button className='mt-4 rounded-full'>Add Vehicle</Button>
                <Button className='mt-4 rounded-full'>Add Hotel</Button>
                <Button className='mt-4 rounded-full'>Add Packages</Button>
            </div>
            <div className="">
                
            </div>
            {/* ProductList */}
        </div>
    )
}

export default ProductList