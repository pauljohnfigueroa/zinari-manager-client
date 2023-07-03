import { act, fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { useMemo } from 'react'
import { Provider, useSelector } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from '../../../state/reduxStore'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'

import { createTheme } from '@mui/material/styles'
import { themeSettings } from 'theme'

import LoginForm from '../LoginForm'
// import userEvent from '@testing-library/user-event'

const MockLoginFormComponent = () => {
	const mode = useSelector(state => state.auth.mode)
	const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])

	return (
		<PersistGate persistor={persistor}>
			<BrowserRouter>
				<ThemeProvider theme={theme}>
					<LoginForm />
				</ThemeProvider>
			</BrowserRouter>
		</PersistGate>
	)
}

const MockLoginForm = () => {
	return (
		<Provider store={store}>
			<MockLoginFormComponent />
		</Provider>
	)
}

describe('Email input', () => {
	// you can have child describe blocks in the parent describe block

	it('should accept a an email input', async () => {
		render(<MockLoginForm />)
		/* 
        When using Formik, we have to wrap the test in act().
        Or you'll see the following error in the console.
        
        Warning: An update to Formik inside a test was not wrapped in act(...).
        When testing, code that causes React state updates should be wrapped into act(...):
        */
		await act(async () => {
			const emailInput = screen.getByTestId('email-input')
			// userEvent.type(emailInput, 'test@email.com')
			fireEvent.change(emailInput, { target: { value: 'test@email.com' } })

			// assertion
			expect(emailInput.value).toBe('test@email.com')
		})
	})
})

describe('Password input', () => {
	// you can have child describe blocks in the parent describe block

	it('should render the Password label in login form.', () => {
		render(<MockLoginForm />)
		const passwordLabel = screen.getByLabelText(/password/i)

		// assertion
		expect(passwordLabel).toBeInTheDocument()
	})

	it('should accept a password input', async () => {
		render(<MockLoginForm />)

		await act(async () => {
			const passwordInput = screen.getByTestId('password-input')
			fireEvent.change(passwordInput, { target: { value: 'password' } })
			// assertion
			expect(passwordInput.value).toBe('password')
		})
	})
})

describe('Login button was clicked', () => {
	// you can have child describe blocks in the parent describe block

	it('should have an empty input fields when the login button is clicked.', async () => {
		render(<MockLoginForm />)

		await act(async () => {
			const emailInput = screen.getByTestId('email-input')
			const passwordInput = screen.getByTestId('password-input')
			const loginButton = screen.getByRole('button')
			fireEvent.click(loginButton)
			// assertion
			expect(emailInput.value).toBe('')
			expect(passwordInput.value).toBe('')
		})
	})
})
