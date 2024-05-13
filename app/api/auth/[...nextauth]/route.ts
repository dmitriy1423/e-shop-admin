import { PrismaAdapter } from '@next-auth/prisma-adapter'
import NextAuth, { AuthOptions, getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import prisma from '@/libs/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/actions/getCurrentUser'
import { SafeUser } from '@/types'
import { Session } from 'inspector'

const isAdminEmail = async (email: string) => {
	return !!(await prisma.admin.findUnique({
		where: { email }
	}))
}

export const authOptions: AuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_SECRET as string
		})
	],
	callbacks: {
		session: async ({ session, token, user }) => {
			if (await isAdminEmail(session?.user?.email as string)) {
				return session
			} else {
				return false
			}
		}
	},

	session: {
		strategy: 'jwt'
	},

	secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

export async function isAdminRequest() {
	const user = await getCurrentUser()

	if (!(await isAdminEmail(user?.email as string))) {
		throw 'not an admin'
	}
}
