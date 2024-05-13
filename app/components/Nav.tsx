'use client'

import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { FC, useState } from 'react'
import {
	MdAdminPanelSettings,
	MdBadge,
	MdCategory,
	MdHome,
	MdList,
	MdLogout,
	MdSettings,
	MdShop
} from 'react-icons/md'
import Logo from './Logo'

interface NavProps {
	isShow?: boolean
	onClick?: () => void
}

const Nav: FC<NavProps> = ({ isShow, onClick }) => {
	const inactiveLink = 'flex items-center gap-1 p-1'
	const activeLink = inactiveLink + ' bg-highlight text-black rounded-sm'
	const inactiveIcon = 'w-6 h-6'
	const activeIcon = inactiveIcon + ' text-primary'
	const pathname = usePathname()
	const router = useRouter()

	const logout = async () => {
		router.push('/')
		await signOut()
	}

	return (
		<aside
			className={`${
				isShow ? 'left-0' : '-left-full'
			} top-0 text-gray-500 p-4 fixed w-full h-full bg-bgGray -left-full md:static md:w-auto transition-all `}
		>
			<div className="mb-4 mr-4">
				<Logo />
			</div>
			<nav className="flex flex-col gap-2">
				<Link
					onClick={onClick}
					href={'/'}
					className={pathname === '/' ? activeLink : inactiveLink}
				>
					<MdHome className={pathname === '/' ? activeIcon : inactiveIcon} />{' '}
					Dashboard
				</Link>
				<Link
					onClick={onClick}
					href={'/products'}
					className={pathname.includes('/products') ? activeLink : inactiveLink}
				>
					<MdBadge
						className={
							pathname.includes('/products') ? activeIcon : inactiveIcon
						}
					/>{' '}
					Products
				</Link>
				<Link
					onClick={onClick}
					href={'/categories'}
					className={
						pathname.includes('/categories') ? activeLink : inactiveLink
					}
				>
					<MdCategory
						className={
							pathname.includes('/categories') ? activeIcon : inactiveIcon
						}
					/>{' '}
					Categories
				</Link>
				<Link
					onClick={onClick}
					href={'/orders'}
					className={pathname.includes('/orders') ? activeLink : inactiveLink}
				>
					<MdList
						className={pathname.includes('/orders') ? activeIcon : inactiveIcon}
					/>{' '}
					Orders
				</Link>
				<Link
					onClick={onClick}
					href={'/admins'}
					className={pathname.includes('/admins') ? activeLink : inactiveLink}
				>
					<MdAdminPanelSettings
						className={pathname.includes('/admins') ? activeIcon : inactiveIcon}
					/>{' '}
					Admins
				</Link>
				<Link
					onClick={onClick}
					href={'/settings'}
					className={pathname.includes('/settings') ? activeLink : inactiveLink}
				>
					<MdSettings
						className={
							pathname.includes('/settings') ? activeIcon : inactiveIcon
						}
					/>{' '}
					Settings
				</Link>
				<button onClick={logout} className={inactiveLink}>
					<MdLogout /> Logout
				</button>
			</nav>
		</aside>
	)
}

export default Nav
