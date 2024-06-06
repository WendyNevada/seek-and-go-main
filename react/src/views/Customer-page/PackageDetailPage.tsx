import ProductPackageDetail from '@/components/customer-exclusive/product-detail/ProductPackageDetail';
import Footer from '@/components/navbar/Footer';
import Navbar from '@/components/navbar/Navbar';
import { useParams } from 'react-router-dom'

const PackageDetailPage = () => {
    const {package_h_id} = useParams();

    return (
        <div>
            <Navbar/>
                <div className="flex mt-[7rem] lg:mt-[6rem] items-center sm:justify-start xl:justify-center">
                    <ProductPackageDetail package_h_id={Number(package_h_id) || 0}/>
                </div>
            <Footer/>
        </div>
    )
}

export default PackageDetailPage
