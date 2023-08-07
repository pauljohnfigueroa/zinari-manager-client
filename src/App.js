import { useMemo } from 'react'
import { BrowserRouter, Routes, Navigate, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import { themeSettings } from './theme'

import LoginPage from './pages/login/LoginPage'
import Layout from 'pages/layout/Layout'
import Dashboard from './pages/dashboard/Dashboard'
import Tasks from './pages/tasks/Tasks'
import Teams from './pages/teams/Teams'
import Projects from './pages/projects/Projects'
import Appraisals from './pages/appraisals/Appraisals'
import Roles from 'pages/admin/roles/Roles'
import Users from 'pages/admin/users/Users'
import useRolePermissions from 'hooks/useRolePermissions'

import ProjectsDrawer from 'pages/projects/ProjectsDrawer'

function App() {
	// get the theme mode from the global state
	const mode = useSelector(state => state.auth.mode)
	const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])

	/* Check if user is authenticated */
	const isAuth = Boolean(useSelector(state => state.auth.token))

	/* Get user's permissions */
	const [authPermissions] = useRolePermissions(process.env.REACT_APP_SERVER_URL)

	return (
		<div className="App">
			<BrowserRouter>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<Routes>
						<Route
							path="/"
							element={<LoginPage />}
						/>
						<Route
							element={isAuth ? <Layout authPermissions={authPermissions} /> : <Navigate to="/" />}
						>
							<Route
								path="/dashboard"
								element={isAuth ? <Dashboard /> : <Navigate to="/" />}
							/>
							<Route
								path="/tasks"
								element={isAuth ? <Tasks authPermissions={authPermissions} /> : <Navigate to="/" />}
							/>
							<Route
								path="/teams"
								element={isAuth ? <Teams authPermissions={authPermissions} /> : <Navigate to="/" />}
							/>
							<Route
								path="/projects"
								element={
									isAuth ? <Projects authPermissions={authPermissions} /> : <Navigate to="/" />
								}
							/>
							<Route
								path="/appraisals"
								element={
									isAuth ? <Appraisals authPermissions={authPermissions} /> : <Navigate to="/" />
								}
							/>
							<Route
								path="/admin/users"
								element={isAuth ? <Users authPermissions={authPermissions} /> : <Navigate to="/" />}
							/>
							<Route
								path="/admin/roles"
								element={isAuth ? <Roles authPermissions={authPermissions} /> : <Navigate to="/" />}
							/>
						</Route>
						<Route
							path="/projects/drawer"
							element={<ProjectsDrawer />}
						/>
					</Routes>
				</ThemeProvider>
			</BrowserRouter>
		</div>
	)
}

export default App
