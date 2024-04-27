import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import React from 'react'
import { OrderH } from '../utils/interface'
import {Table,TableBody,TableCaption,TableCell,TableHead,TableHeader,TableRow} from "@/components/ui/table"

const AcordionByStatus = ( { orders, title }: { orders: OrderH[] | null ; title: string}) => {
  return (
    <div>
        {orders === null ? (
        <Accordion key="no-data" type="single" collapsible>
          <AccordionItem value="item-no-data">
            <AccordionTrigger className="text-2xl font-bold">{title}</AccordionTrigger>
            <AccordionContent className='text-center'>
              <p>No data</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        ) : (
            // orders.map((order) => (
            // <Accordion key={order.order_h_id} type="single" collapsible>
            //     <AccordionItem value={`item-${order.order_h_id}`}>
            //     <AccordionTrigger className="text-2xl font-bold">New Orders</AccordionTrigger>
            //     <AccordionContent>
            //         {/* Render order details here */}
            //         {JSON.stringify(order)}
            //     </AccordionContent>
            //     </AccordionItem>
            // </Accordion>
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-orders">
                        <AccordionTrigger className="text-2xl font-bold">{title}</AccordionTrigger>
                        <AccordionContent>

                                    {/* TABLE */}
                                    <Table>
                                        <TableCaption>A list of your recent Activities.</TableCaption>
                                        <TableHeader>
                                            <TableRow>
                                            <TableHead className="w-[100px]">Order No</TableHead>
                                            <TableHead>Order Date</TableHead>
                                            <TableHead>Order Status</TableHead>
                                            <TableHead className="text-right">Total Price</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {orders.map((order) => (
                                                <TableRow key={order.order_h_id}>
                                                <TableCell className="font-medium">{order.order_no}</TableCell>
                                                <TableCell>{order.order_dt.slice(0, 10)}</TableCell>
                                                <TableCell>{order.order_status} </TableCell>
                                                <TableCell className="text-right">{order.total_price}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>

                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
        )}
    </div>
  )
}

export default AcordionByStatus
