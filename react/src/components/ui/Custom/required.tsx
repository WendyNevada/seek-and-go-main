import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { FormLabel } from "../form"

export function Required() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
            <FormLabel className='text-red-500'>{" *"}</FormLabel>
        </TooltipTrigger>
        <TooltipContent className="bg-red-500 text-neutral-50">
          <p>This field is required</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
