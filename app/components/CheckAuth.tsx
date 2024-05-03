'use client'

import { SafeUser } from '@/types'
import { signIn } from 'next-auth/react'
import { FC, PropsWithChildren, useEffect, useState } from 'react'
import Nav from './Nav'
import { useRouter } from 'next/navigation'
import { MdMenu } from 'react-icons/md'
import Logo from './Logo'

interface CheckAuthProps {
	user: SafeUser | null
}

const CheckAuth: FC<PropsWithChildren<CheckAuthProps>> = ({
	user,
	children
}) => {
	const router = useRouter()
	const [isShowNav, setIsShowNav] = useState(false)

	useEffect(() => {
		if (!user) router.push('/')
	}, [user])

	if (!user) {
		return (
			<div className="bg-bgGray w-screen h-screen flex items-center">
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

	const handleClick = () => {
		setIsShowNav(false)
	}

	return (
		<div className="bg-bgGray min-h-screen">
			<div className="md:hidden flex items-center p-4">
				<button onClick={() => setIsShowNav(true)}>
					<MdMenu size={20} />
				</button>
				<div className="flex grow justify-center mr-6">
					<Logo />
				</div>
			</div>
			<div className=" flex">
				<Nav isShow={isShowNav} onClick={handleClick} />
				<div className="flex-grow p-4">{children}</div>
			</div>
		</div>
	)
}
export default CheckAuth
