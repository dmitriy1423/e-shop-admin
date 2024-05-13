'use client'

import React, { useEffect, useState } from 'react'
import { Product } from '@prisma/client'
import { usePathname } from 'next/navigation'
import axios from 'axios'
import ProductForm from '@/app/components/ProductForm'
import Skeleton from 'react-loading-skeleton'

const EditProduct = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [productInfo, setProductInfo] = useState<Product>()
	const params = usePathname()
	const id = params.split('/').at(-1)

	useEffect(() => {
		if (!id) return
		setIsLoading(true)
		axios
			.get(`/api/products/${id}`)
			.then(response => {
				setProductInfo(response.data)
			})
			.finally(() => setIsLoading(false))
	}, [id])

	return (
		<>
			<h1>Edit Product</h1>
			{isLoading && <Skeleton count={10} height={50} />}
			{productInfo && <ProductForm {...productInfo} />}
		</>
	)
}

export default EditProduct
