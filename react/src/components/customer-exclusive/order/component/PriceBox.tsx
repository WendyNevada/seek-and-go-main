import { formatPrice } from '@/utils/priceFormating';
import { useTranslation } from 'react-i18next';

interface PriceBoxProps {
    price: number;
    qty: number;
    totalPrice: number;
    priceDeduced?: number;
    newPrice?: number;
}

const PriceBox = ({price, qty, totalPrice, priceDeduced, newPrice} : PriceBoxProps) => {
    const { t } = useTranslation();

    return (
        <div>
            <div className="flex flex-row justify-between">
                <p>{t('Sub Total')}</p>
                <p className='font-bold'>{price} x {qty}</p>
            </div>
            {priceDeduced && (
                <div className="flex flex-row justify-between">
                    <p>{t('Price Deduced')}</p>
                <p className='font-bold text-red-500'>- {priceDeduced}</p>
            </div>
            )}
            
            {!newPrice && (
            <div className="flex flex-row justify-between">
                <p>{t('Total')}</p>
                <p className='font-bold'>{formatPrice(totalPrice)}</p>
            </div>
            )}

            {newPrice && (
                <div>
                    <div className="flex flex-row justify-between">
                        <p>{t('Total')}</p>
                        <p className='font-bold line-through'>{formatPrice(totalPrice)}</p>
                    </div>
                    <div className="flex flex-row justify-between">
                        <p>{t('New Total')}</p>
                        <p className='font-bold text-red-500'>{formatPrice(newPrice)}</p>
                    </div>
                </div>
            )}
        </div>
        
    )
}

export default PriceBox
