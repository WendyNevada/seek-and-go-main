import { Button } from '@/components/ui/button'
import React from 'react'
import { Route } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
    const navigate = useNavigate();

    const onRoute = () => {
        navigate('/Agency/AddProduct');
    }

    return (
        <div>
            <div className='flex justify-end'>
                <Button onClick={onRoute} className='mt-4 rounded-full'>Add Product</Button>
            </div>

            {/* ProductList */}
        </div>
    )
}

export default ProductList
