import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
import { isAdminRequest } from '../../auth/[...nextauth]/route'

export async function GET(
	req: NextRequest,
	/* res: NextResponse, */
	{ params }: { params: { id: string } }
) {
	await isAdminRequest()
	const categories = await prisma.category.findUnique({
		where: { id: params.id },
		include: {
			parent: {
				include: {
					properties: true
				}
			},
			child: true
		}
	})

	return NextResponse.json(categories)
}

export async function DELETE(
	req: NextRequest,
	/* res: NextResponse, */
	{ params }: { params: { id: string } }
) {
	await isAdminRequest()
	try {
		const category = await prisma.category.findUnique({
			where: { id: params.id },
			include: { parent: true }
		})

		if (!category) return new Error('Category not found')

		await prisma.category.delete({
			where: { id: params.id },
			include: { parent: true }
		})

		return NextResponse.json(category)
	} catch (error) {
		return NextResponse.json(error)
	}
}
