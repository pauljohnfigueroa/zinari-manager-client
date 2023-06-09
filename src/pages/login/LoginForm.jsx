import { Box, Button, TextField, useMediaQuery, Typography, useTheme } from '@mui/material'
import { Formik } from 'formik'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setLogin } from 'state/authSlice'

const loginSchema = yup.object().shape({
	email: yup.string().email('Invalid email or password').required('required'),
	password: yup.string().required('required')
})

const initialValuesLogin = {
	email: '',
	password: ''
}

const LoginForm = () => {
	const { palette } = useTheme()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const isNonMobile = useMediaQuery('(min-width:600px)')

	/* Form submit handler */

	const handleFormSubmit = async (values, action) => {
		await login(values, action)
	}

	/* Log in user */

	const login = async (values, action) => {
		const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(values)
		})

		const loggedIn = await response.json()

		action.resetForm()

		if (loggedIn) {
			// save the {email, token} in the local storage
			// localStorage.setItem('user', JSON.stringify(loggedIn))
			dispatch(
				setLogin({
					user: loggedIn.user,
					token: loggedIn.token
				})
			)
			navigate('/dashboard')
		}
	}

	return (
		<Formik
			onSubmit={handleFormSubmit} // https://formik.org/docs/guides/form-submission
			initialValues={initialValuesLogin}
			validationSchema={loginSchema}
		>
			{({
				values,
				errors,
				touched,
				handleBlur,
				handleChange,
				handleSubmit, // event.preventDefault() then proceed to onSubmit above
				setFieldValue,
				resetForm
			}) => (
				<form onSubmit={handleSubmit}>
					<Box
						display="grid"
						gap="30px"
						gridTemplateColumns="repeat(4, minmax(0, 1fr))"
						sx={{
							'& > div': { gridColumn: isNonMobile ? undefined : 'span 4' }
						}}
					>
						<TextField
							label="Email"
							type="email"
							onBlur={handleBlur}
							onChange={handleChange}
							value={values.email}
							name="email"
							inputProps={{ 'data-testid': 'email-input' }}
							error={Boolean(touched.email) && Boolean(errors.email)}
							helperText={touched.email && errors.email}
							sx={{ gridColumn: 'span 4' }}
						/>
						<TextField
							label="Password"
							type="password"
							onBlur={handleBlur}
							onChange={handleChange}
							value={values.password}
							name="password"
							inputProps={{ 'data-testid': 'password-input' }}
							error={Boolean(touched.password) && Boolean(errors.password)}
							helperText={touched.password && errors.password}
							sx={{ gridColumn: 'span 4' }}
						/>
					</Box>

					{/* BUTTONS */}
					<Box>
						<Button
							fullWidth
							type="submit"
							sx={{
								m: '2rem 0',
								backgroundColor: palette.neutral.dark,
								color: palette.neutral.light,
								'&:hover': {
									backgroundColor: palette.neutral.main,
									color: palette.neutral.dark
								}
							}}
						>
							<Typography sx={{ fontSize: '1.2rem', p: '.5rem' }}>LOGIN</Typography>
						</Button>
					</Box>
				</form>
			)}
		</Formik>
	)
}

export default LoginForm
