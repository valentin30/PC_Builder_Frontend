import React, { FunctionComponent, useEffect, useMemo } from 'react'
import { CartSideBar } from '../../components/Cart/CartSideBar'
import { CartProductCard } from '../../components/Products/ProductCard/CartProductCard'
import { Header } from '../../components/UI/Header'
import { useCart } from '../../hooks/useCart'
import { CartItem } from '../../types/cart/CartEntry'
import { Product } from '../../types/product/Product'
import styles from './Cart.module.scss'

export const Cart: FunctionComponent = () => {
    const {
        items,
        data: { products, total },
        methods: { populateData, getItemQuantityById }
    } = useCart()

    const disabled: boolean = useMemo(() => (products?.length ? false : true), [products])

    const quantity: number = items.reduce(
        (quantity: number, item: CartItem): number => quantity + item.quantity,
        0
    )

    useEffect(() => {
        populateData()
    }, [populateData])

    return (
        <div className={styles.root}>
            <Header count={quantity}>Cart</Header>
            <ul>
                {products?.map((product: Product) => {
                    return (
                        <CartProductCard
                            key={product.id}
                            quantity={getItemQuantityById(product.id)}
                            product={product}
                        />
                    )
                })}
            </ul>
            <CartSideBar price={total} disabled={disabled} />
        </div>
    )
}
