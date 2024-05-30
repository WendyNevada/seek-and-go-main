import React, { useEffect } from 'react'
import { Payment } from '../interface/interface'
import { useForm } from 'react-hook-form'

const EditAgencyPaymentAccount = ({payment} : {payment : Payment}) => {

    const form = useForm<Payment>({
        defaultValues : payment[0]
    })

    return (
        <div>EditAgencyPaymentAccount</div>
    )
}

export default EditAgencyPaymentAccount
