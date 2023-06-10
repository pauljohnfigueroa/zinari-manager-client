import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

const useFetchTeams = url => {
	const [error, setError] = useState([])
	const [teams, setTeams] = useState([])
	const token = useSelector(state => state.auth.token)

	/* fetch teams */
	useEffect(() => {
		const getTeams = async () => {
			await fetch(`${process.env.REACT_APP_SERVER_URL}/teams`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`
				}
			})
				.then(async response => {
					setTeams(await response.json())
				})
				.catch(err => {
					console.log(err)
					setError(err)
				})
		}
		getTeams()
	}, [])
	return [teams, error]
}

export default useFetchTeams
