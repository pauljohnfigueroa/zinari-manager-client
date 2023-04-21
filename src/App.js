import { useMemo } from 'react'
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

  const isAuth = Boolean(useSelector(state => state.auth.token))

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
              <Route path="/appraisals" element={isAuth ? <Appraisals /> : <Navigate to="/" />} />
              <Route path="/admin/users" element={isAuth ? <Users /> : <Navigate to="/" />} />
              <Route path="/admin/roles" element={isAuth ? <Roles /> : <Navigate to="/" />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
