import { getCurrentUser } from '@/actions/getCurrentUser'
import ClientAdmins from './ClientAdmins'

const Admins = async () => {
	const user = await getCurrentUser()

	return <ClientAdmins user={user} />
}

export default Admins
