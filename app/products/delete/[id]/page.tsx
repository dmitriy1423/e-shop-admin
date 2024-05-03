'use client'
import { useEffect, useState } from 'react'
import { Product } from '@prisma/client'
import { usePathname, useRouter } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'

const DeleteProduct = () => {
	const [productInfo, setProductInfo] = useState<Product>()
	const router = useRouter()
	const params = usePathname()
	const id = params.split('/').at(-1)

	useEffect(() => {
		if (!id) return

		axios.get(`/api/products/${id}`).then(response => {
			setProductInfo(response.data)
		})
	}, [id])

	const deleteProduct = () => {
		axios.delete(`/api/products/${id}`).then(response => {
			router.push('/products')
			toast.success('Product deleted')
		})
	}

	return (
		<>
			<h1 className="text-center">
				Delete your product&nbsp;{productInfo?.title}?
			</h1>
			<div className="flex gap-2 justify-center">
				<button onClick={deleteProduct} className="btn-red">
					Yes
				</button>
				<button
					className="btn-default"
					onClick={() => router.push('/products')}
				>
					No
				</button>
			</div>
		</>
	)
}

export default DeleteProduct
