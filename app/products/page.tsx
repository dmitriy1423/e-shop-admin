'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Product } from '@prisma/client'
import axios from 'axios'
import { MdDelete, MdEdit } from 'react-icons/md'

const Products = () => {
	const [products, setProducts] = useState<Product[]>([])

	useEffect(() => {
		axios.get('/api/products').then(response => {
			setProducts(response.data)
		})
	}, [])

	return (
		<>
			<Link
				className="bg-blue-900 rounded-md text-white py-1 px-2"
				href={'/products/new'}
			>
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
					{products.map(product => (
						<tr key={product.id}>
							<td>{product.title}</td>
							<td>
								<Link href={`/products/edit/${product.id}`}>
									<MdEdit />
									Edit
								</Link>
								<Link href={`/products/delete/${product.id}`}>
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
