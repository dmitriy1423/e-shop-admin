import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
import { isAdminRequest } from '../auth/[...nextauth]/route'

export async function GET(req: NextRequest, res: NextResponse) {
	await isAdminRequest()
	const products = await prisma.product.findMany({
		include: {
			category: true
		}
	})

	return NextResponse.json(products)
}

export async function POST(req: NextRequest, res: NextResponse) {
	await isAdminRequest()
	const body = await req.json()
	const { title, description, price, images, categoryId, properties } = body

	const product = await prisma.product.create({
		data: {
			title,
			description,
			price: parseFloat(price),
			images,
			categoryId,
			properties
		},
		include: {
			category: true
		}
	})

	return NextResponse.json(product)
}

export async function PUT(req: NextRequest, res: NextResponse) {
	await isAdminRequest()
	const body = await req.json()
	const { id, title, description, price, images, categoryId, properties } = body

	const product = await prisma.product.update({
		where: { id },
		data: {
			title,
			description,
			price: parseFloat(price),
			images,
			categoryId,
			properties
		},
		include: {
			category: true
		}
	})

	return NextResponse.json(product)
}
