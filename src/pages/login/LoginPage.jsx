import { Box, Typography, useTheme, useMediaQuery } from '@mui/material'
import LoginForm from './LoginForm'

const LoginPage = () => {
	const theme = useTheme()
	const isNonMobileScreens = useMediaQuery(theme.breakpoints.up('md'))

	return (
		<Box>
			<Box
				width={isNonMobileScreens ? '40%' : '90%'}
				p="2rem"
				m="2rem auto"
				borderRadius="1.5rem"
				backgroundColor={theme.palette.background.alt}
			>
				<Typography variant="h1" fontWeight="bold" fontSize="3rem" color="primary">
					Zinari Management
				</Typography>
				<Typography variant="h6" pb="2rem">
					You cannot manage what you don't measure.
				</Typography>

				<LoginForm />
			</Box>
		</Box>
	)
}

export default LoginPage
