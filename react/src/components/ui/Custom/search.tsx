import { Input } from "@/components/ui/input";
import { useState } from "react";

interface SearchComponentProps {
    className?: string;
    handleSearchChange: (query: string) => void; // Callback function to handle search changes
}

export default function SearchComponent({ className, handleSearchChange }: SearchComponentProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchQuery(value);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSearchChange(searchQuery);
        }
    };

    return (
        <div className={`flex items-center p-2 bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>
            <Input
                className="flex-1 text-gray-900 dark:text-white bg-transparent border-none focus:ring-0 mr-2"
                placeholder="Search..."
                type="text"
                value={searchQuery}
                onChange={handleChange} // Call handleChange function on input change
                onKeyDown={handleKeyPress} // Call handleKeyPress function when a key is pressed
            />
            <SearchIcon className="text-gray-500 dark:text-gray-400" />
        </div>
    );
}

function SearchIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    );
}
