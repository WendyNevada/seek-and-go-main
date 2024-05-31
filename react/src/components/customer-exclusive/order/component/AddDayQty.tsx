import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next';

interface AddDayQtyProps {
    qty: number;
    setQtyDay: (num: number) => void;
  }

const AddDayQty = ({qty,setQtyDay} : AddDayQtyProps) => {

  const { t } = useTranslation();

  return (
    <div>
        <div className="flex flex-row bg-white p-4 inline-block align-middle items-center rounded-xl justify-between">
            <p>{t('Per Day')}</p>
            <div className="space-x-2 flex flex-row items-center">
                <Button className='bg-slate-400' onClick={() => setQtyDay(-1)}>-</Button>
                <p>{qty}</p>
                <Button className='bg-slate-400' onClick={() => setQtyDay(1)}>+</Button>
            </div>
        </div>
    </div>
  )
}

export default AddDayQty
