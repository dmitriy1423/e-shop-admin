'use client'

import React, { useEffect, useState } from 'react'
import { Product } from '@prisma/client'
import { usePathname } from 'next/navigation'
import axios from 'axios'
import ProductForm from '@/app/components/ProductForm'

const EditProduct = () => {
	const [productInfo, setProductInfo] = useState<Product>()
	const params = usePathname()
	const id = params.split('/').at(-1)

	useEffect(() => {
		if (!id) return
		axios.get(`/api/products/${id}`).then(response => {
			setProductInfo(response.data)
			console.log('prod info', response.data)
		})
	}, [id])

	return (
		<>
			<h1>Edit Product</h1>
			{productInfo && <ProductForm {...productInfo} />}
		</>
	)
}

export default EditProduct
