import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import CheckAuth from './components/CheckAuth'
import { getCurrentUser } from '@/actions/getCurrentUser'
import { Toaster } from 'react-hot-toast'
import { Suspense } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Ecomm - Admin',
	description: 'Admin Panel'
}

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	const currentUser = await getCurrentUser()

	return (
		<html lang="en">
			<body className={`${inter.className} `}>
				<Toaster />
				<CheckAuth user={currentUser}>
					<Suspense>{children}</Suspense>
				</CheckAuth>
			</body>
		</html>
	)
}
