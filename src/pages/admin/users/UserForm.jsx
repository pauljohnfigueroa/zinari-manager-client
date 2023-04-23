/* 

The UserForm.jsx component is used on both create and update User.

*/
import { useState } from 'react'

import { Formik, Form, Field } from 'formik'
// import * as yup from 'yup'

import { useSelector, useDispatch } from 'react-redux'
import { createUser, updateUser, addUserFormState } from '../../../state/usersSlice'

// MUI
import {
  Box,
  useMediaQuery,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Checkbox,
  Typography
} from '@mui/material'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

import FlexBetween from 'components/FlexBetween'

import { permissionsValues } from 'data/data'

const UserForm = ({ formLabel, initFormValues }) => {
  const isNonMobile = useMediaQuery('(min-width: 600px)')
  // const [formValues, setFormValues] = useState()
  const [error, setError] = useState()

  const formState = useSelector(state => state.user.formState)
  const token = useSelector(state => state.auth.token)
  const user = useSelector(state => state.auth.user)
  const dispatch = useDispatch()

  // When we do record update, the date format will be in the saved ISO format similar to 2018-04-04T16:00:00.000Z
  // To enable the Update form to load the current record's date,
  // We first need to convert the ISO format date to dayjs format.
  //   const initialFormValues = { ...initFormValues, dueDate: dayjs(initFormValues.dueDate) }
  const initialFormValues = initFormValues

  const handleClose = (event, reason) => {
    if (reason !== 'backdropClick') {
      /* DISPATCH */
      dispatch(addUserFormState({ formState: false }))
    }
  }

  const handleCreateUser = async values => {
    console.log(values)
    // return
    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(values)
    })
    const newUser = await response.json()

    /* DISPATCH */
    dispatch(createUser({ user: newUser }))
    dispatch(addUserFormState({ addUserFormState: false }))
  }

  const handleUpdateUser = async values => {
    console.log(values)
    // Update item from the database - Backend
    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/users/${values._id}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(values)
    })

    /* DISPATCH */
    dispatch(updateUser({ user: values }))
    dispatch(addUserFormState({ addUserFormState: false }))
  }

  return (
    <div>
      {error && <div>{error}</div>}
      <Dialog fullWidth open={formState} onClose={handleClose}>
        <DialogTitle>
          <Typography>{formLabel}</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Please fill up all the required ( * ) fields.</DialogContentText>
          <Formik
            onSubmit={
              initialFormValues._id
                ? (values, actions) => {
                    handleUpdateUser(values)
                  }
                : (values, actions) => {
                    handleCreateUser(values)
                  }
            }
            initialValues={initialFormValues}
          >
            {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
              <Form>
                <Box
                  display="grid"
                  gap="20px"
                  gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                  sx={{
                    '& > div': { gridColumn: isNonMobile ? undefined : 'span 4' }
                  }}
                >
                  <Field type="hidden" id="createdBy" name="createdBy" value={values.createdBy} />

                  <TextField
                    fullWidth
                    autoFocus
                    autoComplete="off"
                    margin="dense"
                    name="firstName"
                    id="firstName"
                    value={values.firstName}
                    label="First Name"
                    type="text"
                    variant="outlined"
                    sx={{ gridColumn: 'span 4' }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  <TextField
                    autoComplete="off"
                    fullWidth
                    margin="dense"
                    name="lastName"
                    id="lastName"
                    value={values.lastName}
                    label="Last Name"
                    type="text"
                    variant="outlined"
                    sx={{ gridColumn: 'span 4' }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  <TextField
                    autoComplete="off"
                    fullWidth
                    margin="dense"
                    name="extName"
                    id="extName"
                    value={values.extName}
                    label="Name Extension"
                    type="text"
                    variant="outlined"
                    sx={{ gridColumn: 'span 4' }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <TextField
                    autoComplete="off"
                    fullWidth
                    margin="dense"
                    name="email"
                    id="email"
                    value={values.email}
                    label="Email"
                    type="email"
                    variant="outlined"
                    sx={{ gridColumn: 'span 4' }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  <TextField
                    autoComplete="off"
                    fullWidth
                    margin="dense"
                    name="phone"
                    id="phone"
                    value={values.phone}
                    label="Phone"
                    type="text"
                    variant="outlined"
                    sx={{ gridColumn: 'span 4' }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  <TextField
                    autoComplete="off"
                    fullWidth
                    margin="dense"
                    name="password"
                    id="password"
                    label="Password"
                    type="password"
                    variant="outlined"
                    sx={{ gridColumn: 'span 4' }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                </Box>
                <DialogActions>
                  <Button sx={{ minWidth: 100 }} onClick={handleClose} variant="outlined">
                    Cancel
                  </Button>
                  <Button type="submit" sx={{ minWidth: 100 }} variant="contained">
                    {values._id ? 'Update' : 'Save'}
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </div>
  )
}
export default UserForm
