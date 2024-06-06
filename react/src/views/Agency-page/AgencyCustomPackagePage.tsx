import AgencyCustomPackage from '@/components/agency-exclusive/custom-package/AgencyCustomPackage'
import AgencyNavbar from '@/components/navbar/AgencyNavbar'
import Footer from '@/components/navbar/Footer'

const AgencyCustomPackagePage = () => {
  return (
    <div>
        <AgencyNavbar/>
        Custom Package
        <div className='flex mt-[7rem] lg:mt-[6rem]  items-center sm:justify-start xl:justify-center'>
            <AgencyCustomPackage/>
        </div>
        <Footer/>
    </div>
  )
}

export default AgencyCustomPackagePage