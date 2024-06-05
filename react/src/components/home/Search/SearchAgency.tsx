import { useEffect, useState } from "react";
import SearchComponent from "../../ui/Custom/search";
import axiosClient from "@/axios.client";
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from "react-router-dom";

interface AgencyData {
    agency_id: number;
    account_id: number;
    agency_name: string;
    npwp: string;
    location: string;
}

const SearchAgency = () => {
    const navigate = useNavigate();

    const [allData, setAllData] = useState<AgencyData[]>([]);
    const [filteredData, setFilteredData] = useState<AgencyData[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch all data initially
    useEffect(() => {
        fetchData();
    }, []);

    // Fetch all data from the API
    const fetchData = async () => {
        try {
            const response = await axiosClient.post('v1/GetAllAgencyForAgencyPage');
            console.log(response.data);
            setAllData(response.data.data); // Store all data
            setFilteredData(response.data.data); // Initially set filtered data to all data
        } catch (error) {
            console.error("Error fetching all data:", error);
        }
    };

    // Filter data based on the search query
    useEffect(() => {
        console.log('query search :', searchQuery);
        if (searchQuery != '') {
            filterData(); // If search query is present, filter data
        } else {
            setFilteredData(allData); // If no search query, display all data
        }
    }, [searchQuery]);

    const filterData = async () => {
        try {
            const response = await axiosClient.post("v1/GetAllAgencySearchBar", {
                keyword: searchQuery // Pass search query as a parameter
            });
            console.log(response.data);
            setFilteredData(response.data.data || []); // Ensure the filtered data is an array
        } catch (error) {
            console.error("Error filtering data:", error);
            setFilteredData([]); // If there's an error, clear filtered data
        }
    };

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
    };

    const handleItemClick = (agency_id: number) => {
        navigate('/AgencySearch/AgencyDetail/' + agency_id);
    };

    return (
        <div className="flex flex-col sm:w-[10rem] md:w-[40rem] lg:w-[80rem] items-center justify-center">
            <div className="sm:w-[50rem] md:w-[60rem] lg:w-[80rem] flex items-center justify-center">
                <SearchComponent className="mt-6 z-40 w-1/3" handleSearchChange={handleSearchChange} />
            </div>

            <ul className="flex flex-col mt-24 min-h-[32rem]">
                {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                        <li onClick={() => {handleItemClick(item.agency_id)}} key={item.agency_id} className="flex rounded overflow-hidden shadow-lg p-2 w-64 h-24 items-center align-middle hover:cursor-pointer">
                            <div className="flex items-center justify-center text-red-400">
                                <PersonIcon className="w-24 h-24" />
                            </div>
                            <div className="flex flex-col p-4">
                                <span>{item.location}</span>
                                <span>{item.agency_name}</span>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="flex justify-center items-center text-gray-500">No data available</li>
                )}
            </ul>
        </div>
    );
}

export default SearchAgency;
