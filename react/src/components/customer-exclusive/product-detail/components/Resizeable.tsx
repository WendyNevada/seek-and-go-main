import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable"
import { useTranslation } from "react-i18next";

interface Props {
    hotelPic?: string | null | undefined;
    attractionPic?: string | null | undefined;
    vehiclePic?: string | null | undefined;
}

export function Resizable( { hotelPic, attractionPic, vehiclePic } : Props ) {
    const enviUrl = import.meta.env.VITE_API_BASE_URL;
    const { t } = useTranslation();

    return (

        <ResizablePanelGroup
        direction="horizontal"
        className="rounded-lg border"
        >
            <ResizablePanel defaultSize={60}>
                <div className="flex h-[25rem] items-center justify-center">
                    { (hotelPic != null && hotelPic != undefined) ? (
                        <img src={enviUrl + hotelPic} alt="Hotel Image" className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex items-center justify-center h-full w-full bg-gray-200">
                            {t('This package has no hotel')}
                        </div>
                    )}
                </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={40}>
                <ResizablePanelGroup direction="vertical">
                    <ResizablePanel defaultSize={50}>
                        <div className="flex h-full">
                            {attractionPic ? (
                                <img src={enviUrl + attractionPic} alt="Not Contain Attraction" className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full w-full bg-gray-200">
                                    {t('This package has no Attraction')}
                                </div>
                            )}
                        </div>
                    </ResizablePanel>
                    <ResizableHandle />
                    <ResizablePanel defaultSize={50}>
                        <div className="flex h-full items-center justify-center">
                            {vehiclePic ? (
                                <img src={enviUrl + vehiclePic} alt="Not Contain Vehicle" className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full w-full bg-gray-200">
                                    {t('This package has no Vehicle')}
                                </div>
                            )}
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
  }
