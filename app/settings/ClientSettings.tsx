'use client'

import { Product } from '@prisma/client'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Skeleton from 'react-loading-skeleton'

const ClientSettings = () => {
	const [products, setProducts] = useState<Product[]>([])
	const [isLoadingProducts, setIsLoadingProducts] = useState(false)
	const [isLoadingSettings, setIsLoadingSettings] = useState(false)

	const {
		register,
		getValues,
		setValue,
		formState: { errors },
		handleSubmit
	} = useForm<FieldValues>({
		defaultValues: {
			featuredProducts: [],
			shippingFee: ''
		}
	})

	useEffect(() => {
		setIsLoadingProducts(true)
		axios
			.get('/api/products')
			.then(response => {
				setProducts(response.data)
			})
			.finally(() => setIsLoadingProducts(false))

		setIsLoadingSettings(true)

		Promise.all([
			axios.get('/api/settings?name=featuredProducts'),
			axios.get('/api/settings?name=shippingFee')
		])
			.then(([featuredProductsResponse, shippingFeeResponse]) => {
				setValue('featuredProducts', featuredProductsResponse.data.values)
				setValue('shippingFee', shippingFeeResponse.data.values)
			})
			.finally(() => setIsLoadingSettings(false))
	}, [])

	const saveFeaturedProduct: SubmitHandler<FieldValues> = async data => {
		Promise.all([
			axios.put('/api/settings', {
				name: 'featuredProducts',
				values: data.featuredProducts
			}),
			axios.put('/api/settings', {
				name: 'shippingFee',
				values: data.shippingFee
			})
		]).then(() => toast.success('Settings saved'))
	}

	return (
		<>
			<h1>Settings</h1>
			{isLoadingProducts || isLoadingSettings ? (
				<Skeleton count={1} height={90} />
			) : (
				<form onSubmit={handleSubmit(saveFeaturedProduct)}>
					<label>Featured product</label>
					<select
						{...register('featuredProducts')}
						multiple
						defaultValue={getValues('featuredProducts')}
					>
						{products.length > 0 &&
							products.map(product => (
								<option value={product.id} key={product.id}>
									{product.title}
								</option>
							))}
					</select>
					<label>Shipping price</label>
					<input {...register('shippingFee')} type="number" />
					<div>
						<button className="btn-primary" type="submit">
							Save settings
						</button>
					</div>
				</form>
			)}
		</>
	)
}

export default ClientSettings
