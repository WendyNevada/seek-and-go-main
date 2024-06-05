

const paymentDetail = ({order_h_id, agency_payment_id} : {order_h_id: number, agency_payment_id: number}) => {
  return (
    <div>
        {order_h_id}
        <br />
        {agency_payment_id}
    </div>
  )
}

export default paymentDetail
