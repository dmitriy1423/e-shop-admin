import { getCurrentUser } from '@/actions/getCurrentUser'

export default async function Home() {
	const currentUser = await getCurrentUser()

	if (!currentUser) return null

	return (
		<div className="text-blue-900 flex justify-between">
			<h2>
				Hello, <b>{currentUser?.name}</b>
			</h2>
			<div className="flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden">
				<img
					src={currentUser.image || ''}
					alt={currentUser.name || ''}
					className="w-6 h-6"
				/>
				<span className="px-2">{currentUser.name}</span>
			</div>
		</div>
	)
}
