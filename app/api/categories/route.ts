import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function GET(req: NextRequest, res: NextResponse) {
	const categories = await prisma.category.findMany({
		include: {
			parent: {
				include: {
					properties: true
				}
			},
			child: true,
			properties: true
		}
	})

	return NextResponse.json(categories)
}

export async function POST(req: NextRequest, res: NextResponse) {
	const body = await req.json()
	const { name, parentCategory, properties } = body

	let category
	try {
		let categoryData = {
			name,
			properties: {
				create: properties.map((prop: { [key: string]: string }) => ({
					name: prop.name,
					values: prop.values.split(',')
				}))
			}
		}

		if (parentCategory) {
			const parentCategoryObject = await prisma.category.findUnique({
				where: { id: parentCategory }
			})

			if (parentCategoryObject) {
				category = await prisma.category.create({
					data: {
						...categoryData,
						parent: {
							connect: { id: parentCategory }
						}
					}
				})
			} else {
				return NextResponse.error()
			}
		} else {
			category = await prisma.category.create({
				data: categoryData
			})
		}

		return NextResponse.json(category)
	} catch (error) {
		console.error('Error creating category:', error)
		return NextResponse.error()
	}
}

export async function PUT(req: NextRequest, res: NextResponse) {
	const body = await req.json()
	const { name, parentCategory, properties, id } = body
	console.log(properties)
	/* return NextResponse.json('ok') */

	/* let category
	try {
		console.log(properties)

		const categoryData = {
			name,
			properties: {
				// Используем update вместо create
				update: properties.map((prop: { [key: string]: string }) => ({
					where: { id: prop.id }, // Указываем ID существующего свойства
					data: {
						name: prop.name,
						values: prop.values.split(',')
					}
				}))
			}
		}

		if (parentCategory) {
			const parentCategoryObject = await prisma.category.findUnique({
				where: { id: parentCategory }
			})

			if (parentCategoryObject) {
				category = await prisma.category.update({
					where: { id },
					data: {
						...categoryData,
						parent: {
							connect: { id: parentCategory }
						}
					}
				})
			} else {
				return NextResponse.error()
			}
		} else {
			category = await prisma.category.update({
				where: { id },
				data: categoryData
			})
		}

		return NextResponse.json(category)
	} catch (error) {
		console.error('Error updating category:', error)
		return NextResponse.error()
	} */

	/* try {
		// Проверяем существование родительской категории
		if (parentCategory) {
			const parentCategoryObject = await prisma.category.findUnique({
				where: { id: parentCategory }
			})

			if (!parentCategoryObject) {
				return NextResponse.error()
			}
		}

		// Подготавливаем данные для обновления категории
		let categoryData: any = { name }
		if (parentCategory) {
			categoryData.parent = { connect: { id: parentCategory } }
		}

		// Обновляем категорию
		const updatedCategory = await prisma.category.update({
			where: { id },
			data: categoryData,
			include: { properties: true } // Включаем свойства для получения текущих значений
		})

		// Обновляем свойства
		if (updatedCategory.properties) {
			// Обновляем существующие свойства
			for (const property of updatedCategory.properties) {
				const propertyIndex = properties.findIndex(
					(p: { name: string }) => p.name === property.name
				)
				if (propertyIndex !== -1) {
					await prisma.property.update({
						where: { id: property.id },
						data: { values: properties[propertyIndex].values.split(',') }
					})
					// Удаляем свойство из массива, чтобы не создавать его заново
					properties.splice(propertyIndex, 1)
				}
			}
		}

		// Создаем новые свойства, если есть
		if (properties.length > 0) {
			await prisma.property.createMany({
				data: properties.map((p: { name: string; values: string }) => ({
					name: p.name,
					values: p.values.split(','),
					categoryId: id
				}))
			})
		}
		console.log(updatedCategory)

		return NextResponse.json(updatedCategory)
	} catch (error) {
		console.error('Error updating category:', error)
		return NextResponse.error()
	} */

	/* try {
		if (parentCategory) {
			const parentCategoryObject = await prisma.category.findUnique({
				where: { id: parentCategory }
			})

			if (!parentCategoryObject) {
				return NextResponse.error()
			}
		}

		let categoryData: any = { name }
		if (parentCategory) {
			categoryData.parent = { connect: { id: parentCategory } }
		}

		const updatedCategory = await prisma.category.update({
			where: { id },
			data: categoryData,
			include: { properties: true }
		})

		await prisma.property.deleteMany({
			where: {
				categoryId: id,
				NOT: {
					name: { in: properties.map((prop: { name: string }) => prop.name) }
				}
			}
		})

		for (const property of properties) {
			const trimmedValues = property.values
				.split(',')
				.map(value => value.trim())

			if (property.id) {
				await prisma.property.update({
					where: { id: property.id },
					data: {
						values: property.values.split(',')
					}
				})
			} else {
				await prisma.property.create({
					data: {
						name: property.name,
						values: property.values.split(','),
						category: { connect: { id } }
					}
				})
			}
		}

		return NextResponse.json(updatedCategory)
	} catch (error) {
		console.error('Error updating category:', error)
		return NextResponse.error()
	} */

	try {
		if (parentCategory) {
			const parentCategoryObject = await prisma.category.findUnique({
				where: { id: parentCategory }
			})

			if (!parentCategoryObject) {
				return NextResponse.error()
			}
		}

		let categoryData: any = { name }
		if (parentCategory) {
			categoryData.parent = { connect: { id: parentCategory } }
		}

		const updatedCategory = await prisma.category.update({
			where: { id },
			data: categoryData,
			include: { properties: true }
		})

		await prisma.property.deleteMany({
			where: {
				categoryId: id,
				NOT: {
					name: { in: properties.map((prop: { name: string }) => prop.name) }
				}
			}
		})

		for (const property of properties) {
			const trimmedValues = property.values
				.split(',')
				.map((value: string) => value.trim())

			const existingProperty = await prisma.property.findFirst({
				where: {
					categoryId: id,
					name: property.name
				}
			})

			if (existingProperty) {
				await prisma.property.update({
					where: { id: existingProperty.id },
					data: { values: trimmedValues }
				})
			} else {
				await prisma.property.create({
					data: {
						name: property.name,
						values: trimmedValues,
						category: { connect: { id } }
					}
				})
			}
		}

		return NextResponse.json(updatedCategory)
	} catch (error) {
		console.error('Error updating category:', error)
		return NextResponse.error()
	}
}
