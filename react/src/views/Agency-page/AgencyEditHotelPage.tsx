import EditHotel from '@/components/agency-exclusive/add-hotel/EditHotel';
import AgencyNavbar from '@/components/navbar/AgencyNavbar';
import { useParams } from 'react-router-dom';

const AgencyEditHotelPage = () => {
    const { ref_hotel_id } = useParams();

    return (
        <div>
            <AgencyNavbar/>
            <div className="text-3xl mt-20">
                <EditHotel ref_hotel_id={Number(ref_hotel_id) || 0} />
            </div>
        </div>
    )
}

export default AgencyEditHotelPage
