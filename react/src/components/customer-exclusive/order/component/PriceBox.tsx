import { formatPrice } from '@/utils/priceFormating';
import { useTranslation } from 'react-i18next';

interface PriceBoxProps {
    price: number;
    qty: number;
    totalPrice: number;
}

const PriceBox = ({price, qty, totalPrice} : PriceBoxProps) => {
    const { t } = useTranslation();

    return (
        <div>
            <div className="flex flex-row justify-between">
                <p>{t('Sub Total')}</p>
                <p className='font-bold'>{price} x {qty}</p>
            </div>
            <div className="flex flex-row justify-between">
                <p>{t('Total')}</p>
                <p className='tetx font-bold'>{formatPrice(totalPrice)}</p>
            </div>
        </div>
    )
}

export default PriceBox
