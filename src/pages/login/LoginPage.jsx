import { Box, Typography, useTheme, useMediaQuery } from '@mui/material'
import LoginForm from './LoginForm'

const LoginPage = () => {
  const isNonMobileScreens = useMediaQuery('(min-width: 600px)')
  const theme = useTheme()

  return (
    <Box>
      <Box
        width={isNonMobileScreens ? '40%' : '90%'}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight="bold" fontSize="32px" color="primary">
          Zinari Management
        </Typography>
        <Typography pb="2rem">You cannot manage what you don't measure.</Typography>

        <LoginForm />
      </Box>
    </Box>
  )
}

export default LoginPage
