import EditAttraction from '@/components/agency-exclusive/add-attraction/EditAttraction'
import AgencyNavbar from '@/components/navbar/AgencyNavbar'
import { useParams } from 'react-router-dom';

const AgencyEditAttractionPage = () => {
    const { ref_attraction_id } = useParams(); // Extract ref_attraction_id from URL parameters

  return (
    <div>
        <AgencyNavbar/>
        <div className="text-3xl mt-20">
            <EditAttraction ref_attraction_id={Number(ref_attraction_id) || 0} />
        </div>
    </div>
  )
}

export default AgencyEditAttractionPage
