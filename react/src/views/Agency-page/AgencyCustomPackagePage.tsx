import AgencyCustomPackage from '@/components/agency-exclusive/custom-package/AgencyCustomPackage'
import AgencyNavbar from '@/components/navbar/AgencyNavbar'

const AgencyCustomPackagePage = () => {
  return (
    <div>
        <AgencyNavbar/>
        Custom Package
        <div className='flex mt-[7rem] lg:mt-[6rem]  items-center sm:justify-start xl:justify-center'>
            <AgencyCustomPackage/>
        </div>
    </div>
  )
}

export default AgencyCustomPackagePage
