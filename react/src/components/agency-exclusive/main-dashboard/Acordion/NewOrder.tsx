import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import React from 'react'
import { Order } from '../utils/interface'

const NewOrder = ( { orders }: { orders: Order[] }) => {
  return (
    <div>
        {/* <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
                <AccordionTrigger className="text-2xl font-bold">New Orders</AccordionTrigger>
                <AccordionContent>
                    {order.total_price}
                    Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
            </AccordionItem>
        </Accordion> */}
        {orders.map((order) => (
            <Accordion key={order.order_h_id} type="single" collapsible>
            <AccordionItem value={`item-${order.order_h_id}`}>
                <AccordionTrigger className="text-2xl font-bold">New Orders</AccordionTrigger>
                <AccordionContent>
                {/* Render order details here */}
                {JSON.stringify(order)}
                </AccordionContent>
            </AccordionItem>
            </Accordion>
      ))}
    </div>
  )
}

export default NewOrder
