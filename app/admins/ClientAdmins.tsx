'use client'

import { SafeUser } from '@/types'
import { Admin } from '@prisma/client'
import axios from 'axios'
import { FC, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Skeleton from 'react-loading-skeleton'
import { withSwal } from 'react-sweetalert2'

interface ClientAdminsProps {
	user: SafeUser | null
}

const ClientAdmins: FC<ClientAdminsProps> = ({ user }) => {
	const {
		formState: { errors },
		register,
		getValues,
		setValue,
		handleSubmit,
		control
	} = useForm<FieldValues>({
		defaultValues: {
			email: ''
		}
	})

	const [isLoading, setIsLoading] = useState(false)
	const [admins, setAdmins] = useState<Admin[]>([])

	const addAdmin: SubmitHandler<FieldValues> = async data => {
		if (data.email === user?.email) return toast.error('Admin already exists')
		axios
			.post('/api/admins', data)
			.then(response => {
				setValue('email', '')
				loadAdmins()
				typeof response.data === 'string'
					? toast.error(response.data)
					: toast.success('Admin added')
			})
			.catch(error => {
				setValue('email', '')
			})
	}

	const loadAdmins = () => {
		setIsLoading(true)
		axios
			.get('/api/admins')
			.then(response => {
				setAdmins(response.data)
			})
			.finally(() => setIsLoading(false))
	}

	useEffect(() => {
		loadAdmins()
	}, [])

	const deleteAdmin = (admin: Admin) => {
		if (admin.email === user?.email) return toast.error('You are admin')
		axios
			.delete(`/api/admins/${admin.id}`)
			.then(() => {
				loadAdmins()
				toast.success('Admin deleted')
			})
			.catch(error => {
				toast.error(error.data)
			})
	}

	return (
		<>
			<h1>Admins</h1>
			<h2>Add new admin</h2>
			<form onSubmit={handleSubmit(addAdmin)}>
				<div className="flex gap-2">
					<input
						{...register('email', { required: true })}
						type="email"
						placeholder="Admin goggle email"
						className={`mb-0 `}
						required
					/>
					<button className="btn-primary py-1 whitespace-nowrap" type="submit">
						Add admin
					</button>
				</div>
			</form>
			<h2>Existing admins</h2>
			<table className="basic">
				<thead>
					<tr>
						<th className="text-left">Admin google email</th>
						<th>Add date</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{isLoading ? (
						<tr>
							<td colSpan={2}>
								<div className="py-4">
									<Skeleton count={5} />
								</div>
							</td>
						</tr>
					) : (
						admins.length > 0 &&
						admins.map(admin => (
							<tr key={admin.id}>
								<td>{admin.email}</td>
								<td>{new Date(admin.createdAt).toLocaleString()}</td>
								<td>
									<div className="flex">
										<button
											onClick={() => deleteAdmin(admin)}
											className="btn-red"
										>
											Delete
										</button>
									</div>
								</td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</>
	)
}

export default ClientAdmins
