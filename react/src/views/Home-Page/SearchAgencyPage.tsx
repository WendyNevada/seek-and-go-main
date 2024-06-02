import SearchAgency from '@/components/home/Search/SearchAgency'
import Footer from '@/components/navbar/Footer'
import Navbar from '@/components/navbar/Navbar'

const SearchAgencyPage = () => {
  return (
    <div>
        <Navbar/>
            <div className="flex mt-[7rem] lg:mt-[6rem]  items-center sm:justify-start xl:justify-center">
                <SearchAgency/>
            </div>
        <Footer/>
    </div>
  )
}

export default SearchAgencyPage
