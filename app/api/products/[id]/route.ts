import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
import { isAdminRequest } from '../../auth/[...nextauth]/route'

export async function GET(
	req: NextRequest,
	/* res: NextResponse, */
	{ params }: { params: { id: string } }
) {
	await isAdminRequest()
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
	req: NextRequest,
	/* res: NextResponse, */
	{ params }: { params: { id: string } }
) {
	await isAdminRequest()
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
