import React, { FunctionComponent, useCallback, useRef, useState } from 'react'
import { GET_FULL_IMAGE_URL } from '../../../constants'
import { WithMediaQuery } from '../../../hoc/WithMediaQuery'
import { Image } from '../../../types/product/Image'
import styles from './ImageSlider.module.scss'

interface Props {
    images: Image[]
}

export const ImageSlider: FunctionComponent<Props> = props => {
    const sliderRef = useRef<HTMLUListElement>(null)

    const [index, setIndex] = useState<number>(0)

    const clickHandler = useCallback((index: number) => {
        setIndex(index)
    }, [])

    return (
        <>
            <WithMediaQuery maxWidth={800}>
                <div>
                    <ul className={styles.root} ref={sliderRef}>
                        {props.images.map((image: Image) => (
                            <li
                                key={image.id}
                                style={{
                                    transform: `translate(${
                                        index * -(sliderRef.current?.clientWidth || 0)
                                    }px)`
                                }}
                            >
                                <img src={GET_FULL_IMAGE_URL(image.url)} alt='product' />
                            </li>
                        ))}
                    </ul>
                    <ul className={styles.small}>
                        {props.images.map((image: Image, i: number) => (
                            <li
                                className={i === index ? styles.active : ''}
                                key={image.id}
                                onClick={clickHandler.bind(null, i)}
                            >
                                <img src={GET_FULL_IMAGE_URL(image.url)} alt='product' />
                            </li>
                        ))}
                    </ul>
                </div>
            </WithMediaQuery>
            <WithMediaQuery minWidth={800}>
                <div className={styles.mobile}>
                    <img src={GET_FULL_IMAGE_URL(props.images[0].url)} alt='product' />
                </div>
            </WithMediaQuery>
        </>
    )
}
