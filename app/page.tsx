import { getCurrentUser } from '@/actions/getCurrentUser'
import HomeHeader from './components/HomeHeader'
import HomeStats from './components/HomeStats'

export default async function Home() {
	const currentUser = await getCurrentUser()

	if (!currentUser) return null

	return (
		<>
			<HomeHeader user={currentUser} />
			<HomeStats />
		</>
	)
}
