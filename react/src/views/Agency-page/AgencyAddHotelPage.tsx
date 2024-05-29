import AddHotel from '@/components/agency-exclusive/add-hotel/AddHotel'
import AgencyNavbar from '@/components/navbar/AgencyNavbar'

const AgencyAddHotelPage = () => {
  return (
    <div>
        <AgencyNavbar/>
        <div className="text-3xl mt-20">
            <AddHotel/>
        </div>

    </div>
  )
}

export default AgencyAddHotelPage
