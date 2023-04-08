import { useMemo } from 'react'
import { BrowserRouter, Routes, Navigate, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import { themeSettings } from './theme'

import LoginPage from './pages/login/LoginPage'
import Dashboard from './pages/users/Dashboard'

function App() {

  // get the theme mode from the global state
  const mode = useSelector(state => state.mode)
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])

  const isAuth = Boolean(useSelector(state => state.token))

  return (
    <div className="App">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Navigate to='/' />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
