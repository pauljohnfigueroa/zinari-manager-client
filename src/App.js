import { useMemo, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Navigate, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import { themeSettings } from './theme'

import LoginPage from './pages/login/LoginPage'
import Layout from 'pages/layout/Layout'
import Dashboard from './pages/users/Dashboard'
import Tasks from './pages/tasks/Tasks'
import Teams from './pages/teams/Teams'
import Projects from './pages/projects/Projects'
import Appraisals from './pages/appraisals/Appraisals'
import Roles from 'pages/admin/roles/Roles'
import Users from 'pages/admin/users/Users'

function App() {
  // get the theme mode from the global state
  const mode = useSelector(state => state.auth.mode)
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])
  const user = useSelector(state => state.auth.user)
  const token = useSelector(state => state.auth.token)
  const isAuth = Boolean(useSelector(state => state.auth.token))

  const [authPermissions, setAuthPermissions] = useState([])

  /* Fetch the current user's permissions 
      then pass it to components as props. */
  useEffect(() => {
    const getPermissions = async () => {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/roles/${user.role}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      })
      const role = await response.json()
      //console.log('json', role.permissions)
      setAuthPermissions(role[0].permissions)
    }
    // only if user.role exists
    if (user?.role) getPermissions()
  }, [])
  // console.log('authPermissions', authPermissions)
  return (
    <div className="App">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route element={isAuth ? <Layout /> : <Navigate to="/" />}>
              <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Navigate to="/" />} />
              <Route path="/tasks" element={isAuth ? <Tasks /> : <Navigate to="/" />} />
              <Route path="/teams" element={isAuth ? <Teams /> : <Navigate to="/" />} />
              <Route path="/projects" element={isAuth ? <Projects /> : <Navigate to="/" />} />
              <Route
                path="/appraisals"
                element={
                  isAuth && authPermissions.includes('view_appraisals_dashboard') ? (
                    <Appraisals />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path="/admin/users"
                element={isAuth ? <Users authPermissions={authPermissions} /> : <Navigate to="/" />}
              />
              <Route path="/admin/roles" element={isAuth ? <Roles /> : <Navigate to="/" />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
