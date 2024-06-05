import AgencyCustomPackageDetail from '@/components/agency-exclusive/custom-package/AgencyCustomPackageDetail';
import AgencyNavbar from '@/components/navbar/AgencyNavbar';
import { useParams } from 'react-router-dom';

const AgencyCustomPackageDetailPage = () => {
    const { package_h_id } = useParams();

  return (
    <div>
        <AgencyNavbar/>
        <div className='min-w-28 mt-40 sm:mt-40 md:mt-40 max-w-screen-xl sm:mx-80'>
            <AgencyCustomPackageDetail package_h_id={Number(package_h_id) || 0}/>
        </div>
    </div>
  )
}

export default AgencyCustomPackageDetailPage