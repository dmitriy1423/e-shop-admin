'use client'

import { Order } from '@prisma/client'
import axios from 'axios'
import { subHours } from 'date-fns'
import { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'

const HomeStats = () => {
	const [orders, setOrders] = useState<Order[]>([])
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		setIsLoading(true)
		axios
			.get('/api/orders')
			.then(response => {
				setOrders(response.data)
			})
			.finally(() => setIsLoading(false))
	}, [])

	const ordersTotal = (orders: Order[]) => {
		return orders.reduce((acc, order) => {
			return (
				acc +
				order.line_items.reduce((acc, line_item) => {
					return acc + line_item.price_data.unit_amount * line_item.quantity
				}, 0)
			)
		}, 0)
	}

	if (isLoading) {
		return (
			<div className="my-4">
				<Skeleton count={2} height={120} />
			</div>
		)
	}

	const ordersToday = orders
		.filter(order => new Date(order.createdAt) > subHours(new Date(), 24))
		.filter(order => order.paid)
	const ordersWeek = orders
		.filter(order => new Date(order.createdAt) > subHours(new Date(), 24 * 7))
		.filter(order => order.paid)
	const ordersMonth = orders
		.filter(order => new Date(order.createdAt) > subHours(new Date(), 24 * 30))
		.filter(order => order.paid)

	return (
		<div>
			<h2>Orders</h2>
			<div className="tiles-grid">
				<div className="tile">
					<h3 className="tile-header">Today</h3>
					<div className="tile-number">{ordersToday.length}</div>
					<div className="tile-desc">{ordersToday.length} orders today</div>
				</div>
				<div className="tile">
					<h3 className="tile-header">This week</h3>
					<div className="tile-number">{ordersWeek.length}</div>
					<div className="tile-desc">{ordersWeek.length} orders this week</div>
				</div>
				<div className="tile">
					<h3 className="tile-header">This month</h3>
					<div className="tile-number">{ordersMonth.length}</div>
					<div className="tile-desc">
						{ordersMonth.length} orders this month
					</div>
				</div>
			</div>
			<h2>Revenue</h2>
			<div className="grid grid-cols-3 gap-4">
				<div className="tile">
					<h3 className="tile-header">Today</h3>
					<div className="tile-number">${ordersTotal(ordersToday)}</div>
					<div className="tile-desc">{ordersToday.length} orders today</div>
				</div>
				<div className="tile">
					<h3 className="tile-header">This week</h3>
					<div className="tile-number">${ordersTotal(ordersWeek)}</div>
					<div className="tile-desc">{ordersWeek.length} orders this week</div>
				</div>
				<div className="tile">
					<h3 className="tile-header">This month</h3>
					<div className="tile-number">${ordersTotal(ordersMonth)}</div>
					<div className="tile-desc">
						{ordersMonth.length} orders this month
					</div>
				</div>
			</div>
		</div>
	)
}

export default HomeStats
