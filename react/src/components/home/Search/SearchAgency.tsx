import { useEffect, useState } from "react";
import SearchComponent from "../../ui/Custom/search";
import axiosClient from "@/axios.client";
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";

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
    const [loading, setLoading] = useState(true);

    // Fetch all data initially
    useEffect(() => {
        fetchData();
    }, []);

    // Fetch all data from the API
    const fetchData = async () => {
        try {
            const response = await axiosClient.post('v1/GetAllAgencyForAgencyPage');
            setAllData(response.data.data); // Store all data
            setFilteredData(response.data.data); // Initially set filtered data to all data
        } catch (error) {
            console.error("Error fetching all data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter data based on the search query
    useEffect(() => {
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
            setFilteredData(response.data.data || []); // Ensure the filtered data is an array
            setLoading(false);
        } catch (error) {
            console.error("Error filtering data:", error);
            setFilteredData([]); // If there's an error, clear filtered data
        } finally {
            setLoading(false);
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

            {loading ? (
                <div className="flex justify-center items-center min-h-screen">
                    <HashLoader size={50} color={"#123abc"} loading={loading} />
                </div>
            ) : (
                <ul className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8 md:mt-12 w-full max-w-[80rem] min-h-[34rem]">
                    {filteredData.length > 0 ? (
                        filteredData.map((item) => (
                        <li key={item.agency_id} onClick={() => handleItemClick(item.agency_id)} className="flex rounded-lg overflow-hidden shadow-md cursor-pointer max-h-24">
                            <div className="flex items-center justify-center bg-red-400 text-white w-24 h-24">
                            <PersonIcon className="w-16 h-16" />
                            </div>
                            <div className="flex flex-col p-4">
                            <span className="font-semibold">{item.agency_name}</span>
                            <span className="text-gray-600">{item.location}</span>
                            </div>
                        </li>
                        ))
                    ) : (
                        <li className="flex justify-center items-center text-gray-500">No data available</li>
                    )}
                </ul>
            )}
        </div>
    );
}

export default SearchAgency;
