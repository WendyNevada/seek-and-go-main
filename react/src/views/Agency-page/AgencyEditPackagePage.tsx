import EditPackage from '@/components/agency-exclusive/add-package/EditPackage';
import AgencyNavbar from '@/components/navbar/AgencyNavbar';
import { useParams } from 'react-router-dom';

const AgencyEditPackagePage = () => {
    const { package_h_id } = useParams();
    return (
        <div>
            <AgencyNavbar/>
            <div className="text-3xl mt-20">
                <EditPackage package_h_id={Number(package_h_id) || 0}/>
            </div>
        </div>
    )
}

export default AgencyEditPackagePage
