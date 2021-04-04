import { Elements } from '@stripe/react-stripe-js'
import { loadStripe, Stripe } from '@stripe/stripe-js'
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react'
import { CheckoutForm } from '../../components/Checkout/CheckoutForm'
import { CreateShippingAddressForm } from '../../components/Checkout/CreateShippingAddressForm'
import { OrderSummary } from '../../components/Checkout/OrderSummary'
import { ShippingAddressCard } from '../../components/Checkout/ShippingAddressCard'
import { PrimaryButton } from '../../components/UI/PrimaryButton/PrimaryButton'
import { Header } from '../../components/UI/Header'
import { Label } from '../../components/UI/Label'
import { useShippingAddress } from '../../hooks/HTTP/useShippingAddress'
import { CreateShippingAddressDto } from '../../types/order/CreateShippingAddressDto'
import { ShippingAddress } from '../../types/order/ShippingAddress'
import styles from './Checkout.module.scss'
import { Card, Typography } from '@material-ui/core'

const promise: Promise<Stripe | null> = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY ?? '')

export const Checkout: FunctionComponent = props => {
    const { getShippingAddresses, shippingAddresses, createShippingAddress } = useShippingAddress()

    const [selected, setSelected] = useState<number | null>(null)

    const [open, setOpen] = useState<boolean>(false)

    const submitHandler = useCallback(
        async (createShippingAddressDto: CreateShippingAddressDto) => {
            await createShippingAddress(createShippingAddressDto)
            setOpen(false)
        },
        [createShippingAddress]
    )

    useEffect(() => {
        getShippingAddresses()
    }, [getShippingAddresses])

    return (
        <div className={styles.root}>
            <Header>Checkout</Header>
            <Typography
                className={styles.shippingAddress}
                variant='subtitle2'
                color='textSecondary'
            >
                Shipping Address
            </Typography>
            <Card variant='outlined'>
                {shippingAddresses?.map((address: ShippingAddress) => (
                    <ShippingAddressCard
                        key={address.id}
                        changeHandler={setSelected}
                        selected={selected}
                        address={address}
                    />
                ))}
                {open ? (
                    <CreateShippingAddressForm onSubmit={submitHandler} />
                ) : (
                    <PrimaryButton
                        onClick={() => {
                            setOpen(true)
                        }}
                    >
                        Add Address
                    </PrimaryButton>
                )}
            </Card>
            <Typography
                className={styles.cardInformation}
                variant='subtitle2'
                color='textSecondary'
            >
                Card Information
            </Typography>
            <section>
                <Elements stripe={promise}>
                    <CheckoutForm shippingAddressId={selected} />
                </Elements>
                <OrderSummary />
            </section>
        </div>
    )
}
