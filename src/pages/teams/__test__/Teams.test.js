import { screen, render } from '@testing-library/react'
import '@testing-library/jest-dom'

import { useMemo } from 'react'
import { Provider, useSelector } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from '../../../state/reduxStore'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'

import { createTheme } from '@mui/material/styles'
import { themeSettings } from 'theme'

import Teams from '../Teams'

const MockTeamsComponent = () => {
	const mode = useSelector(state => state.auth.mode)
	const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])
	return (
		<PersistGate persistor={persistor}>
			<BrowserRouter>
				<ThemeProvider theme={theme}>
					<Teams />
				</ThemeProvider>
			</BrowserRouter>
		</PersistGate>
	)
}

const MockTeams = () => {
	return (
		<Provider store={store}>
			<MockTeamsComponent />
		</Provider>
	)
}

describe('Teams', () => {
	it('should render the Teams datagrid', async () => {
		//render(<MockTeams />)
	})
})
