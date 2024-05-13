import prisma from '@/libs/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from '../auth/[...nextauth]/route'

export async function GET() {
	const admins = await prisma.admin.findMany({})
	return NextResponse.json(admins)
}

export async function POST(req: NextRequest, res: NextResponse) {
	await isAdminRequest()
	const body = await req.json()
	const { email } = body

	const existingAdmin = await prisma.admin.findUnique({
		where: { email }
	})

	if (existingAdmin) {
		return NextResponse.json('Already exists')
	}

	const admin = await prisma.admin.create({
		data: { email }
	})

	return NextResponse.json(admin)
}
