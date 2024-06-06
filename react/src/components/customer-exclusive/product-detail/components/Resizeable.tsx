import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable"

interface Props {
    hotelPic: string;
    attractionPic: string;
    vehiclePic: string;
}

export function Resizable( { hotelPic, attractionPic, vehiclePic } : Props ) {
    return (
        <ResizablePanelGroup
        direction="horizontal"
        className="rounded-lg border"
        >
            <ResizablePanel defaultSize={60}>
                <div className="flex h-[25rem] items-center justify-center">
                    <img src={hotelPic} alt="" className="h-full w-full object-cover"/>
                </div>
                </ResizablePanel>
                <ResizableHandle />
                    <ResizablePanel defaultSize={40}>
                    <ResizablePanelGroup direction="vertical">
                        <ResizablePanel defaultSize={50}>
                            <div className="flex h-full">
                                <img src={attractionPic} alt="" className="h-full w-full object-cover"/>
                            </div>
                        </ResizablePanel>
                        <ResizableHandle />
                        <ResizablePanel defaultSize={50}>
                            <div className="flex h-full items-center justify-center">
                                <img src={vehiclePic} alt="" className="h-full w-full object-cover"/>
                            </div>
                        </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
  }
