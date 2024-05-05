import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function GET(req: NextRequest, res: NextResponse) {
	const orders = await prisma.order.findMany({
		orderBy: {
			createdAt: 'desc'
		}
	})
	return NextResponse.json(orders)
}
