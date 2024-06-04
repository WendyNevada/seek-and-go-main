import { formatPrice } from '@/utils/priceFormating';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import HashLoader from 'react-spinners/HashLoader';

interface PriceBoxProps {
    price: number;
    qty: number;
    totalPrice: number;
    priceDeduced?: number;
    newPrice?: number;
    loadingPromo?: boolean;
}

const PriceBox = ({price, qty, totalPrice, priceDeduced, newPrice, loadingPromo} : PriceBoxProps) => {
    const { t } = useTranslation();

    return (
        <div>
            {loadingPromo ? (
            <div className="flex flex-row justify-center items-center">
                <HashLoader size={50} color={"#123abc"} loading={loadingPromo} />
            </div>
            ) : (
            <>
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
            </>
            )}
        </div>
        
    )
}

export default PriceBox
