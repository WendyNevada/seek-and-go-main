import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next';

//Yang di comment adalah method kalau mau nyambungin rangedatepicker ke qty

interface AddDayQtyProps {
    qty: number;
    setQtyDay: (num: number) => void;
    //onQtyChange: (newQty: number) => void;
  }

  const AddDayQty = ({ qty, setQtyDay, 
    // onQtyChange 
  }: AddDayQtyProps) => {
    const { t } = useTranslation();
  
    const handleQtyChange = (num: number) => {
      setQtyDay(num);
      //onQtyChange(qty + num);
    };
  
    return (
      <div>
          <div className="flex flex-row bg-white p-4 inline-block align-middle items-center rounded-xl justify-between">
              <p>{t('Ticket(s)')}</p>
              <div className="space-x-2 flex flex-row items-center">
                  <Button className='bg-slate-400' onClick={() => handleQtyChange(-1)}>-</Button>
                  <p>{qty}</p>
                  <Button className='bg-slate-400' onClick={() => handleQtyChange(1)}>+</Button>
              </div>
          </div>
      </div>
    )
  }

export default AddDayQty
