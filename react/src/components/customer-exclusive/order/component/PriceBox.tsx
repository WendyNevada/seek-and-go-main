import { formatPrice } from '@/utils/priceFormating';

interface PriceBoxProps {
    price: number;
    qty: number;
    totalPrice: number;
}

const PriceBox = ({price, qty, totalPrice} : PriceBoxProps) => {
    return (
        <div>
            <div className="flex flex-row justify-between">
                <p>Per Day</p>
                <p>{price} x {qty}</p>
            </div>
            <div className="flex flex-row justify-between">
                <p>Total</p>
                <p className='tetx'>{formatPrice(totalPrice)}</p>
            </div>
        </div>
    )
}

export default PriceBox
