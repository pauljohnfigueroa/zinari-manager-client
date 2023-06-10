import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const useFetchUsers = () => {
	const [error, setError] = useState([])
	const [users, setUsers] = useState([])
	const token = useSelector(state => state.auth.token)

	useEffect(() => {
		const getUsers = async () => {
			await fetch(`${process.env.REACT_APP_SERVER_URL}/users`, {
				method: 'GET',
				headers: { Authorization: `Bearer ${token}` }
			})
				.then(async response => {
					const users = await response.json()
					setUsers(users)
				})
				.catch(err => {
					console.log(err)
					setError(err)
				})
		}
		getUsers()
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	return [users, error]
}

export default useFetchUsers
