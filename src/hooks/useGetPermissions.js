import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const useGetPermissions = url => {
  const user = useSelector(state => state.auth.user)
  const token = useSelector(state => state.auth.token)
  const [authPermissions, setAuthPermissions] = useState([])

  useEffect(() => {
    const getPermissions = async () => {
      await fetch(`${url}/roles/${user.role}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(async response => {
          const role = await response.json()
          setAuthPermissions(role[0].permissions)
        })
        .catch(error => console.log(error.message))
    }
    if (user?.role) getPermissions()
  }, [url, token, user])

  return [authPermissions]
}

export default useGetPermissions
