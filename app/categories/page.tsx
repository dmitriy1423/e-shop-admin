'use client'

import { Category, Property } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
	FieldValues,
	SubmitHandler,
	useFieldArray,
	useForm
} from 'react-hook-form'
import toast from 'react-hot-toast'
import { withSwal } from 'react-sweetalert2'

export type ExtendedCategory = Category & {
	parent: Category
	child: Category[]
	properties?: Property[]
}

const Categories = ({ swal }: { swal: any }) => {
	const { register, handleSubmit, setValue, control } = useForm<FieldValues>({
		defaultValues: {
			name: '',
			parentCategory: '',
			properties: []
		}
	})
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'properties'
	})
	const router = useRouter()
	const [categories, setCategories] = useState<ExtendedCategory[]>([])
	const [editedCategory, setEditedCategory] = useState<ExtendedCategory | null>(
		null
	)

	useEffect(() => {
		fetchCategories()
	}, [])

	const fetchCategories = () => {
		axios.get('/api/categories').then(response => {
			setCategories(response.data)
		})
	}

	const saveCategory: SubmitHandler<FieldValues> = async data => {
		console.log(data)
		if (editedCategory) {
			await axios
				.put('/api/categories', { ...data, id: editedCategory.id })
				.then(res => {
					toast.success('Category edited')
					setEditedCategory(null)
				})
		} else {
			await axios.post('/api/categories', data).then(res => {
				toast.success('Category created')
			})
		}

		setValue('name', '')
		setValue('parentCategory', '')
		setValue('properties', [])
		fetchCategories()
	}

	const editCategory = (category: ExtendedCategory) => {
		setEditedCategory(category)
		setValue('name', category.name)
		setValue('parentCategory', category.parentId)

		if (category.properties) {
			category.properties.forEach((property, index) => {
				setValue(
					'properties',
					category.properties?.map(({ name, values }) => ({
						name,
						values: values.join(',')
					}))
				)
				console.log(category.properties)
			})
		}
	}

	const deleteCategory = (category: ExtendedCategory) => {
		swal
			.fire({
				title: 'Are you sure ?',
				text: `Do you want to delete ${category.name}`,
				showCancelButton: true,
				cancelButtonText: 'Cancel',
				confirmButtonText: 'Yes, Delete!',
				confirmButtonColor: '#d55',
				reverseButtons: true
			})
			.then((result: any) => {
				if (category?.child && category?.child?.length > 0) {
					toast.error(
						"This category has child categories. You can't delete it unless a child category equals the parent category."
					)
					return
				}
				if (result.isConfirmed) {
					axios.delete(`/api/categories/${category.id}`).then(res => {
						toast.success('Category deleted')
						fetchCategories()
					})
				}
			})
	}

	const addProperty = () => {
		append({ name: '', values: '' })
	}

	const handlePropertyNameChange = (index, newName) => {
		fields[index].name = newName
	}

	const handlePropertyValuesChange = (index, newValues) => {
		fields[index].values = newValues
	}

	const removeProperty = indexToRemove => {
		remove(indexToRemove)
	}

	/* const properties = watch('properties') */

	return (
		<>
			<h1>Categories</h1>
			<label>
				{editedCategory
					? `Edit category ${editedCategory.name}`
					: 'Create new category'}
			</label>
			<form onSubmit={handleSubmit(saveCategory)}>
				<div className="flex gap-1">
					<input
						{...register('name')}
						className="mb-0"
						type="text"
						placeholder="Category name"
					/>
					<select {...register('parentCategory')} className="mb-0">
						<option value={'0'}>No parent category</option>
						{categories.map(category => (
							<option value={category.id} key={category.id}>
								{category.name}
							</option>
						))}
					</select>
				</div>
				<div className="mb-2">
					<label className="block">Properties</label>
					<button
						onClick={addProperty}
						type="button"
						className="btn-default text-sm"
					>
						Add new property
					</button>
					{fields.map((property, index) => (
						<div className="flex gap-1 mb-2" key={index}>
							<input
								{...register(`properties.${index}.name`)}
								className="mb-0"
								onChange={e => handlePropertyNameChange(index, e.target.value)}
								type="text"
								placeholder="Property name (example: color)"
							/>
							<input
								{...register(`properties.${index}.values`)}
								className="mb-0"
								onChange={e =>
									handlePropertyValuesChange(index, e.target.value)
								}
								type="text"
								placeholder="Values, separated"
							/>
							<button
								onClick={() => removeProperty(index)}
								type="button"
								className="btn-default"
							>
								Remove
							</button>
						</div>
					))}
				</div>
				<div className="flex gap-1">
					{editedCategory && (
						<button
							type="button"
							onClick={() => {
								setEditedCategory(null)
								setValue('name', '')
								setValue('parentCategory', '')
								setValue('properties', [])
							}}
							className="btn-default"
						>
							Cancel
						</button>
					)}

					<button type="submit" className="btn btn-primary py-1">
						Save
					</button>
				</div>
			</form>
			{!editedCategory && (
				<table className="basic mt-4">
					<thead>
						<tr>
							<td>Category name</td>
							<td>Parent category</td>
							<td></td>
						</tr>
					</thead>
					<tbody>
						{categories.length > 0 &&
							categories.map(category => (
								<tr key={category.id}>
									<td>{category.name}</td>
									<td>{category?.parent?.name}</td>
									<td>
										<div className="flex">
											<button
												onClick={() => editCategory(category)}
												className="btn-primary mr-1"
											>
												Edit
											</button>
											<button
												onClick={() => deleteCategory(category)}
												className="btn-primary"
											>
												Delete
											</button>
										</div>
									</td>
								</tr>
							))}
					</tbody>
				</table>
			)}
		</>
	)
}

/* export default Categories */

export default withSwal(({ swal }: { swal: any }, ref: any) => (
	<Categories swal={swal} />
))
