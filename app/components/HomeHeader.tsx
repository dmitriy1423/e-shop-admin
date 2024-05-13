'use client'

import { SafeUser } from '@/types'
import { FC } from 'react'

interface HomeHeaderProps {
	user: SafeUser | null
}

const HomeHeader: FC<HomeHeaderProps> = ({ user }) => {
	return (
		<div className="text-blue-900 flex justify-between items-center">
			<h2 className="m-0">
				<div className="flex gap-2 items-center">
					<img
						src={user?.image || ''}
						alt={user?.name || ''}
						className="w-6 h-6 rounded-md sm:hidden"
					/>
					<div>
						Hello, <b>{user?.name}</b>
					</div>
				</div>
			</h2>
			<div className="hidden sm:block">
				<div className="bg-gray-300 flex gap-1 text-black rounded-lg overflow-hidden">
					<img
						src={user?.image || ''}
						alt={user?.name || ''}
						className="w-6 h-6 rounded-md"
					/>
					<span className="px-2">{user?.name}</span>
				</div>
			</div>
		</div>
	)
}

export default HomeHeader
