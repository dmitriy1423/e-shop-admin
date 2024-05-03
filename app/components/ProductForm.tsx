'use client'

import firebaseApp from '@/libs/firebase'
import axios from 'axios'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import {
	ChangeHandler,
	FieldValues,
	SubmitHandler,
	useForm
} from 'react-hook-form'
import toast from 'react-hot-toast'
import { MdUpload } from 'react-icons/md'
import Spinner from './Spinner'
import { ReactSortable } from 'react-sortablejs'
import { ExtendedCategory } from '../categories/page'
import { JsonValue } from '@prisma/client/runtime/library'

interface ProductFormProps {
	id?: string
	title?: string
	description?: string
	price?: number
	images?: string[]
	categoryId?: string | null
	properties?: JsonValue
}

const ProductForm: FC<ProductFormProps> = ({
	id,
	title: existingTitle,
	description: existingDescription,
	price: existingPrice,
	images: existingImages,
	categoryId: existingCategoryId,
	properties: existingProperties
}) => {
	const router = useRouter()
	const [isUploading, setIsUploading] = useState(false)
	const [categories, setCategories] = useState<ExtendedCategory[]>([])

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		getValues,
		control,
		trigger,
		formState: { errors }
	} = useForm<FieldValues>({
		defaultValues: {
			title: existingTitle || '',
			description: existingDescription || '',
			price: existingPrice || 0,
			images: existingImages || [],
			categoryId: existingCategoryId || '',
			properties: {}
		}
	})

	useEffect(() => {
		axios.get('/api/categories').then(result => {
			setCategories(result.data)
		})
	}, [])

	useEffect(() => {
		console.log(existingCategoryId)
		if (existingCategoryId) {
			axios.get(`/api/categories/${existingCategoryId}`).then(result => {
				setValue('categoryId', result.data.id)
			})
		}
	}, [existingCategoryId, setValue, getValues('properties')])

	const saveProduct: SubmitHandler<FieldValues> = async data => {
		if (id) {
			await axios.put('/api/products', { ...data, id }).then(res => {
				router.push('/products')
				toast.success('Product updated')
			})
		} else {
			await axios.post('/api/products', data).then(res => {
				router.push('/products')
				toast.success('Product created')
			})
		}
	}

	const uploadImages: ChangeHandler = async e => {
		const uploadedFiles = e.target.files

		if (uploadedFiles && uploadedFiles.length > 0) {
			setIsUploading(true)
			const imagePaths = [...getValues('images')]

			for (let i = 0; i < uploadedFiles.length; i++) {
				const file = uploadedFiles[i]
				const fileName = new Date().getTime() + '-' + file.name
				const storage = getStorage(firebaseApp)
				const storageRef = ref(storage, `images/${fileName}`)

				try {
					const snapshot = await uploadBytes(storageRef, file)
					const downloadURL = await getDownloadURL(snapshot.ref)
					imagePaths.push(downloadURL)
					toast.success('Image uploaded')
				} catch (error) {
					toast.error('Error uploading image')
					console.error('Error uploading image:', error)
				}
			}

			setValue('images', imagePaths)
			setIsUploading(false)
			console.log(imagePaths)
		}
	}

	function updateImagesOrder(images: any) {
		setValue('images', images)
	}

	const productImages = watch('images')
	const category = watch('categoryId')

	const propertiesToFill = []
	if (categories.length > 0 && category) {
		let catInfo = categories.find(({ id }) => id === category)
		propertiesToFill.push(...catInfo?.properties)
		while (catInfo?.parent?.id) {
			const parentCat = categories.find(({ id }) => id === catInfo?.parent.id)
			propertiesToFill.push(...parentCat?.properties)
			catInfo = parentCat
		}
	}

	return (
		<div>
			<form onSubmit={handleSubmit(saveProduct)}>
				<label>Product name</label>
				<input {...register('title')} type="text" placeholder="prod name" />
				<label>Category</label>
				<select {...register('categoryId')}>
					<option value={''}>Uncategorized</option>
					{categories.length > 0 &&
						categories.map(category => (
							<option key={category.id} value={category.id}>
								{category.name}
							</option>
						))}
				</select>
				{propertiesToFill.length > 0 &&
					propertiesToFill.map((p, index) => (
						<div className="" key={index}>
							<label>{p.name[0].toUpperCase() + p.name.slice(1)}</label>
							<div>
								<select
									{...register(`properties[${p.name}]`)}
									defaultValue={getValues(`properties[${p.name}]`)}
								>
									{p.values.map((v, idx) => (
										<option key={idx} value={v}>
											{v}
										</option>
									))}
								</select>
							</div>
						</div>
					))}
				<label>Photos</label>

				<div className="mb-2 flex flex-wrap gap-1">
					<ReactSortable
						className="flex flex-wrap gap-1"
						list={productImages}
						setList={updateImagesOrder}
					>
						{!!productImages?.length &&
							productImages.map((link: string) => (
								<div
									key={link}
									className="h-24 bg-white p-4 shadow-sm rounded-sm border-gray-200"
								>
									<img
										src={link}
										alt=""
										className="rounded-lg object-contain aspect-square"
									/>
								</div>
							))}
					</ReactSortable>
					{isUploading && (
						<div className="h-24 p-1 flex items-center">
							<Spinner />
						</div>
					)}
					<label className="w-24 h-24 cursor-pointer border text-center text-sm flex flex-col items-center justify-center gap-1 text-primary rounded-sm bg-white shadow-sm border-primary">
						<MdUpload />
						<div>Add Image</div>
						<input
							type="file"
							className="hidden"
							{...register('images')}
							onChange={uploadImages}
						/>
					</label>
				</div>
				<label>Description</label>
				<textarea {...register('description')} placeholder="desc" />
				<label>Price (in USD)</label>
				<input {...register('price')} type="number" placeholder="price" />
				<button type="submit" className="btn-primary">
					Save
				</button>
			</form>
		</div>
	)
}

export default ProductForm
