import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from '../../auth/[...nextauth]/route'
import prisma from '@/libs/prisma'
import { getCurrentUser } from '@/actions/getCurrentUser'

export async function DELETE({ params }: { params: { id: string } }) {
	await isAdminRequest()
	const user = await getCurrentUser()

	try {
		const admin = await prisma.admin.findUnique({
			where: { id: params.id }
		})

		if (user?.email === admin?.email) return new Error('You are admin')

		if (!admin) return new Error('Admin not found')

		await prisma.admin.delete({
			where: { id: params.id }
		})

		return NextResponse.json(admin)
	} catch (error) {
		return NextResponse.json(error)
	}
}
