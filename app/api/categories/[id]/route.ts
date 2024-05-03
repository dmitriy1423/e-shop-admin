import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
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
	req: Request,
	{ params }: { params: { id: string } }
) {
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
