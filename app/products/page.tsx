'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Product } from '@prisma/client'
import axios from 'axios'
import { MdDelete, MdEdit } from 'react-icons/md'
import Skeleton from 'react-loading-skeleton'

const Products = () => {
	const [products, setProducts] = useState<Product[]>([])
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		setIsLoading(true)
		axios
			.get('/api/products')
			.then(response => {
				setProducts(response.data)
			})
			.finally(() => setIsLoading(false))
	}, [])

	return (
		<>
			<Link className="btn-primary" href={'/products/new'}>
				Add new product
			</Link>
			<table className="basic mt-2">
				<thead>
					<tr>
						<td>Product name</td>
						<td></td>
					</tr>
				</thead>
				<tbody>
					{isLoading && (
						<tr>
							<td colSpan={2}>
								<div className="py-4">
									<Skeleton count={10} />
								</div>
							</td>
						</tr>
					)}

					{products.map(product => (
						<tr key={product.id}>
							<td>{product.title}</td>
							<td>
								<Link
									href={`/products/edit/${product.id}`}
									className="btn-default"
								>
									<MdEdit />
									Edit
								</Link>
								<Link
									href={`/products/delete/${product.id}`}
									className="btn-red"
								>
									<MdDelete />
									Delete
								</Link>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	)
}

export default Products
