/**
 * v0 by Vercel.
 * @see https://v0.dev/t/CJkBViYBB3l
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Input } from "@/components/ui/input"

export default function SearchComponent({ className }: { className?: string }) {
  return (
    <div className={`flex items-center p-2 bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>
      <Input
        className="flex-1 text-gray-900 dark:text-white bg-transparent border-none focus:ring-0 mr-2"
        placeholder="Search..."
        type="text"
      />
      <SearchIcon className="text-gray-500 dark:text-gray-400" />
    </div>
  )
}

// interface SearchIconProps {
//     className?: string;
//     // add other expected properties here
//   }

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
  )
}
