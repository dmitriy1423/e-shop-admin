'use client'

import { SafeUser } from '@/types'
import { signIn } from 'next-auth/react'
import { FC, PropsWithChildren } from 'react'
import Nav from './Nav'

interface CheckAuthProps {
	user: SafeUser | null
}

const CheckAuth: FC<PropsWithChildren<CheckAuthProps>> = ({
	user,
	children
}) => {
	if (!user) {
		return (
			<div className="bg-blue-900 w-screen h-screen flex items-center">
				<div className="text-center w-full">
					<button
						onClick={() => signIn('google')}
						className="bg-white p-2 px-4 rounded-lg"
					>
						Login with Goggle
					</button>
				</div>
			</div>
		)
	}

	return (
		<div className="bg-blue-900 min-h-screen flex">
			<Nav />
			<div className="bg-white flex-grow mt-2 mr-2 mb-2 rounded-lg p-4">
				{children}
			</div>
		</div>
	)
}
export default CheckAuth
