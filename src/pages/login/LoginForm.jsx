import { useState } from 'react'
import { Box, Button, TextField, useMediaQuery, Typography, useTheme } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { Formik } from 'formik'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setLogin } from 'state/redux'
import Dropzone from 'react-dropzone'
import FlexBetween from 'components/FlexBetween'

const registerSchema = yup.object().shape({
  firstName: yup.string().required('required'),
  lastName: yup.string().required('required'),
  email: yup.string().email('invalid email').required('required'),
  password: yup.string().required('required'),
  location: yup.string().required('required'),
  occupation: yup.string().required('required'),
  picture: yup.string().required('required')
})

const loginSchema = yup.object().shape({
  email: yup.string().email('invalid email').required('required'),
  password: yup.string().required('required')
})

const initialValuesRegister = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  location: '',
  occupation: '',
  picture: ''
}

const initialValuesLogin = {
  email: '',
  password: ''
}

const LoginForm = () => {
  const [pageType, setPageType] = useState('login')
  const { palette } = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isNonMobile = useMediaQuery('(min-width:600px)')
  const isLogin = pageType === 'login'
  const isRegister = pageType === 'register'

  const register = async (values, onSubmitProps) => {
    // send form with image
    const formData = new FormData()
    for (let value in values) {
      formData.append(value, values[value])
    }
    formData.append('picturePath', values.picture.name)

    const savedUserResponse = await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/register`, {
      method: 'POST',
      body: formData
    })
    const savedUser = await savedUserResponse.json()
    onSubmitProps.resetForm()

    if (savedUser) {
      setPageType('login')
    }
  }

  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    })
    const loggedIn = await loggedInResponse.json()
    onSubmitProps.resetForm()
    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token
        })
      )
      navigate('/home')
    }
  }

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps)
  }

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
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
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
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
                backgroundColor: palette.primary.dark,
                color: palette.neutral.light,
                '&:hover': {
                  backgroundColor: palette.primary.main,
                  color: palette.neutral.light
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
