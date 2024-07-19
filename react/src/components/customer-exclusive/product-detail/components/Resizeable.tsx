import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable"

interface Props {
    hotelPic?: string | null;
    attractionPic?: string | null;
    vehiclePic?: string | null;
}

export function Resizable( { hotelPic, attractionPic, vehiclePic } : Props ) {
    return (
        <ResizablePanelGroup
        direction="horizontal"
        className="rounded-lg border"
        >
            <ResizablePanel defaultSize={60}>
                <div className="flex h-[25rem] items-center justify-center">
                    {hotelPic ? (
                        <img src={hotelPic} alt="Hotel" className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex items-center justify-center h-full w-full bg-gray-200">No Image</div>
                    )}
                </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={40}>
                <ResizablePanelGroup direction="vertical">
                    <ResizablePanel defaultSize={50}>
                        <div className="flex h-full">
                            {attractionPic ? (
                                <img src={attractionPic} alt="Attraction" className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full w-full bg-gray-200">No Image</div>
                            )}
                        </div>
                    </ResizablePanel>
                    <ResizableHandle />
                    <ResizablePanel defaultSize={50}>
                        <div className="flex h-full items-center justify-center">
                            {vehiclePic ? (
                                <img src={vehiclePic} alt="Vehicle" className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full w-full bg-gray-200">No Image</div>
                            )}
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
  }
