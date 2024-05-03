'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import {
	MdBadge,
	MdCategory,
	MdHome,
	MdList,
	MdSettings,
	MdShop
} from 'react-icons/md'

const Nav = () => {
	const inactiveLink = 'flex items-center gap-1 p-1'
	const activeLink = inactiveLink + ' bg-white text-blue-900 rounded-l-lg'
	const pathname = usePathname()

	return (
		<aside className="text-white p-4 pr-0">
			<Link href={'/'} className="flex items-center gap-1 mb-4 mr-4">
				<MdShop />
				<span className="">EcommAdmin</span>
			</Link>
			<nav className="flex flex-col gap-2">
				<Link
					href={'/'}
					className={pathname === '/' ? activeLink : inactiveLink}
				>
					<MdHome /> Dashboard
				</Link>
				<Link
					href={'/products'}
					className={pathname.includes('/products') ? activeLink : inactiveLink}
				>
					<MdBadge /> Products
				</Link>
				<Link
					href={'/categories'}
					className={
						pathname.includes('/categories') ? activeLink : inactiveLink
					}
				>
					<MdCategory /> Categories
				</Link>
				<Link
					href={'/orders'}
					className={pathname.includes('/orders') ? activeLink : inactiveLink}
				>
					<MdList /> Orders
				</Link>
				<Link
					href={'/settings'}
					className={pathname.includes('/settings') ? activeLink : inactiveLink}
				>
					<MdSettings /> Settings
				</Link>
			</nav>
		</aside>
	)
}

export default Nav