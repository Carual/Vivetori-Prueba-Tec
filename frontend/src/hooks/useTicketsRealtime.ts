import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Ticket } from '../types/ticket'

export function useTicketsRealtime() {
	const [tickets, setTickets] = useState<Ticket[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	async function reload() {
		setError(null)
		setLoading(true)

		const { data, error } = await supabase.from('tickets').select('*').order('created_at', { ascending: false }).limit(200)

		if (error) {
			setError(error.message)
			setTickets([])
			setLoading(false)
			return
		}

		setTickets((data as Ticket[]) ?? [])
		setLoading(false)
	}

	useEffect(() => {
		reload()

		const channel = supabase
			.channel('tickets-realtime')
			.on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, payload => {
				setTickets(current => {
					const eventType = payload.eventType

					if (eventType === 'INSERT') {
						const row = payload.new as Ticket
						if (current.some(t => t.id === row.id)) return current
						return [row, ...current]
					}

					if (eventType === 'UPDATE') {
						const row = payload.new as Ticket
						return current.map(t => (t.id === row.id ? row : t))
					}

					if (eventType === 'DELETE') {
						const oldRow = payload.old as Ticket
						return current.filter(t => t.id !== oldRow.id)
					}

					return current
				})
			})
			.subscribe()

		return () => {
			supabase.removeChannel(channel)
		}
	}, [])

	const stats = useMemo(() => {
		const total = tickets.length
		const pending = tickets.filter(t => !t.processed).length
		const processed = total - pending
		const negative = tickets.filter(t => t.sentiment === 'Negativo').length
		return { total, pending, processed, negative }
	}, [tickets])

	const sortedTickets = useMemo(() => {
		return [...tickets].sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
	}, [tickets])

	return { tickets: sortedTickets, stats, loading, error, reload }
}
