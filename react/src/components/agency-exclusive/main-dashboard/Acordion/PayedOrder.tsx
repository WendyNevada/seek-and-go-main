import React from 'react'
import { Order } from '../utils/interface'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const PayedOrder = ( { orders }: { orders: Order[] | null }) => {
  return (
    <div>
        {orders === null ? (
        <Accordion key="no-data" type="single" collapsible>
          <AccordionItem value="item-no-data">
            <AccordionTrigger className="text-2xl font-bold">Payed Orders</AccordionTrigger>
            <AccordionContent className='text-center'>
              <p>No data</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        ) : (
            orders.map((order) => (
            <Accordion key={order.order_h_id} type="single" collapsible>
                <AccordionItem value={`item-${order.order_h_id}`}>
                <AccordionTrigger className="text-2xl font-bold">Payed Orders</AccordionTrigger>
                <AccordionContent>
                    {/* Render order details here */}
                    {JSON.stringify(order)}
                </AccordionContent>
                </AccordionItem>
            </Accordion>
            ))
        )}
    </div>
  )
}

export default PayedOrder
