import React, { useCallback, useEffect, useState } from 'react'
import { IoSearchSharp } from 'react-icons/io5'
import { BiLoaderAlt } from 'react-icons/bi'
import { Link, useLocation } from 'react-router-dom'
import { useClickAway } from '../../../hooks/ClickAway/useClickAway'
import { useFetch } from '../../../hooks/Fetch/useFetch'
import { Product } from '../../../interfaces/Product'
import { ProductArrayResponse } from '../../../interfaces/ProductArrayResponse'
import { NotFound } from './NotFound'
import styles from './SearchInput.module.scss'
import { SearchResult } from './SearchResult'

interface Props {}

export const SearchInput: React.FC<Props> = props => {
    const [search, setSearch] = useState<string>('')

    const { isOpen, close, open } = useClickAway(false)

    const location = useLocation()

    const searchProductsHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value)
    }

    const {
        state: { data, error, loading },
        fetchData
    } = useFetch<ProductArrayResponse>()

    const inputClickHandler = useCallback(
        (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
            if (search) open(event)
        },
        [open, search]
    )

    useEffect(() => {
        setSearch('')
    }, [location])

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search) {
                fetchData(`${process.env.REACT_APP_API_URL}/product?filters=${search}`)
                open()
            }
        }, 1000)

        if (!search) close()

        return () => clearTimeout(timeout)
    }, [search, fetchData, open, close])

    return (
        <div className={styles.root}>
            <IoSearchSharp />
            <input
                type='text'
                placeholder='Search...'
                value={search}
                onChange={searchProductsHandler}
                onClick={inputClickHandler}
            />
            {loading ? <BiLoaderAlt style={{ position: 'absolute', left: '100%' }} /> : null}
            {isOpen ? (
                <ul onClick={close}>
                    {data?.products.slice(0, 3).map((product: Product) => {
                        return <SearchResult key={product.id} product={product} />
                    })}
                    {data ? (
                        <li className={styles.allProducts}>
                            <Link to={`/products?filters=${search}`}>
                                See all {data.products.length} results.
                            </Link>
                        </li>
                    ) : null}
                    {error ? <NotFound /> : null}
                </ul>
            ) : null}
        </div>
    )
}