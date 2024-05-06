import OrderApproval from '@/components/agency-exclusive/main-dashboard/approval/OrderApproval';
import AgencyNavbar from '@/components/navbar/AgencyNavbar';
import React from 'react'
import { useParams } from 'react-router-dom';

const AgencyOrderApprovalPage = () => {
    const { order_h_id } = useParams();

    return (
        <div>
            <AgencyNavbar/>
            AgencyOrderApprovalPage {order_h_id}
            <div className='min-w-28 mt-40 sm:mt-40 md:mt-40 max-w-screen-xl sm:mx-80'>
                <OrderApproval order_h_id={Number(order_h_id) || 0}/>
            </div>
        </div>
    )
}

export default AgencyOrderApprovalPage
