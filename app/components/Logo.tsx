import Link from 'next/link'
import { MdShop } from 'react-icons/md'

const Logo = () => {
	return (
		<Link href={'/'} className="flex items-center gap-1">
			<MdShop />
			<span className="">EcommAdmin</span>
		</Link>
	)
}

export default Logo
