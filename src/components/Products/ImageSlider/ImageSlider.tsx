import React, { useCallback, useRef, useState } from 'react'
import { WithMediaQuery } from '../../../hoc/WithMediaQuery'
import { useWindowSize } from '../../../hooks/useWindowSize'
import { Image } from '../../../types/Image'
import styles from './ImageSlider.module.scss'

interface Props {
    images: Image[]
}

export const ImageSlider: React.FC<Props> = props => {
    const sliderRef = useRef<HTMLUListElement>(null)

    const [index, setIndex] = useState<number>(0)

    const clickHandler = useCallback((index: number) => {
        setIndex(index)
    }, [])

    return (
        <>
            <WithMediaQuery maxWidth={800}>
                <>
                    <ul className={styles.root} ref={sliderRef}>
                        {props.images.map((image: Image) => {
                            return (
                                <li
                                    key={image.id}
                                    style={{
                                        transform: `translate(${
                                            index * -(sliderRef.current?.clientWidth || 0)
                                        }px)`
                                    }}
                                >
                                    <img
                                        src={`${process.env.REACT_APP_API_URL}${image.url}`}
                                        alt='product'
                                    />
                                </li>
                            )
                        })}
                    </ul>
                    <ul className={styles.small}>
                        {props.images.map((image: Image, i: number) => {
                            return (
                                <li
                                    className={i === index ? styles.active : ''}
                                    key={image.id}
                                    onClick={clickHandler.bind(null, i)}
                                >
                                    <img
                                        src={`${process.env.REACT_APP_API_URL}${image.url}`}
                                        alt='product'
                                    />
                                </li>
                            )
                        })}
                    </ul>
                </>
            </WithMediaQuery>
            <WithMediaQuery minWidth={800}>
                <div className={styles.mobile}>
                    <img
                        src={`${process.env.REACT_APP_API_URL}${props.images[0].url}`}
                        alt='product'
                    />
                </div>
            </WithMediaQuery>
        </>
    )
}
