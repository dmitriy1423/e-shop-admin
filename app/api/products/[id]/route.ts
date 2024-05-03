import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function GET(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const product = await prisma.product.findUnique({
			where: { id: params.id }
		})

		return NextResponse.json(product)
	} catch (error) {
		return NextResponse.json(error)
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const product = await prisma.product.findUnique({
			where: { id: params.id }
		})

		if (!product) return new Error('Product not found')

		await prisma.product.delete({
			where: { id: params.id }
		})

		return NextResponse.json(product)
	} catch (error) {
		return NextResponse.json(error)
	}
}
