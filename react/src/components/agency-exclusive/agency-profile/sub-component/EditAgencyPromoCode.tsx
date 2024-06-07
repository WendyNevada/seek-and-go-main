import { useEffect} from "react";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AgencyPromo } from "../interface/interface";


const EditAgencyPromoCode = ({promoDataRows} : {promoDataRows: AgencyPromo[]}) => {
    const { t } = useTranslation();

    return (
        <div>
            <div className="p-5 text-xl flex flex-col">
              <hr className='border-2' />
              <br />
              <div className="">
                <Table>
                  <TableCaption>
                    <h1 className="text-2xl">{t('Feel Free To Use These Promo Code On Your Products')}</h1>
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('Promo Code')}</TableHead>
                      <TableHead className="w-36">{t('Start Date')}</TableHead>
                      <TableHead>{t('End Date')}</TableHead>
                      <TableHead className="text-center">{t('Attraction')}</TableHead>
                      <TableHead className="text-center">{t('Hotel')}</TableHead>
                      <TableHead className="text-center">{t('Vehicle')}</TableHead>
                      <TableHead className="text-center">{t('Amount')}</TableHead>
                      <TableHead className="text-center">{t('Percent')}</TableHead>
                      <TableHead className="text-center">{t('Max Use')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {promoDataRows && promoDataRows.length > 0 ? (
                        promoDataRows.map((dataRow, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-bold">
                                    {dataRow.promo_code || "N/A"}
                                </TableCell>
                                <TableCell>
                                    {dataRow.start_date?.split(" ")[0] || "N/A"}
                                </TableCell>
                                <TableCell>
                                    {dataRow.end_date?.split(" ")[0] || "N/A"}
                                </TableCell>
                                <TableCell className="text-center">
                                    {dataRow.is_attraction ? t('Yes') : t('No')}
                                </TableCell>
                                <TableCell className="text-center">
                                    {dataRow.is_hotel ? t('Yes') : t('No')}
                                </TableCell>
                                <TableCell className="text-center">
                                    {dataRow.is_vehicle ? t('Yes') : t('No')}
                                </TableCell>
                                <TableCell className="text-center">
                                    {dataRow.amount == 0 ? "-" : dataRow.amount}
                                </TableCell>
                                <TableCell className="text-center">
                                    {dataRow.percent == 0 ? "-" : dataRow.percent + "%"}
                                </TableCell>
                                <TableCell className="text-center">
                                    {dataRow.max_use == 0 ? 0 : dataRow.max_use}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={9} className="text-center">
                                {t('No promos are available')}
                            </TableCell>
                        </TableRow>
                    )}
                    <TableRow>
                        <TableCell>
                        </TableCell>
                    </TableRow>
                  </TableBody>
                  <TableFooter>
                  </TableFooter>
                </Table>
              </div>
            </div>
        </div>
    )
}

export default EditAgencyPromoCode