/* 

The RoleForm.jsx component is used on both create and update Role.

*/
import { useState } from 'react'

import { Formik, Form, Field } from 'formik'
// import * as yup from 'yup'

import { useSelector, useDispatch } from 'react-redux'
import { createRole, updateRole, addRoleFormState } from '../../../state/rolesSlice'

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
  Checkbox
} from '@mui/material'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

import dayjs from 'dayjs'

const RoleForm = ({ formLabel, initFormValues }) => {
  const isNonMobile = useMediaQuery('(min-width: 600px)')
  // const [formValues, setFormValues] = useState()
  const [error, setError] = useState()

  const formState = useSelector(state => state.role.formState)
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
      dispatch(addRoleFormState({ formState: false }))
    }
  }

  const handleCreateRole = async values => {
    // await registerUser(values.email, values.name, values.password, values.phone, values.roles)
    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/roles`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(values)
    })
    const newRole = await response.json()

    /* DISPATCH */
    dispatch(createRole({ role: newRole }))
    dispatch(addRoleFormState({ addRoleFormState: false }))
  }

  const handleUpdateRole = async values => {
    console.log(values)
    // Update item from the database - Backend
    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/roles/${values._id}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(values)
    })

    /* DISPATCH */
    dispatch(updateRole({ role: values }))
    dispatch(addRoleFormState({ addRoleFormState: false }))
  }

  return (
    <div>
      {error && <div>{error}</div>}
      <Dialog fullWidth open={formState} onClose={handleClose}>
        <DialogTitle>{formLabel}</DialogTitle>
        <DialogContent>
          <DialogContentText>Please fill up all the required ( * ) fields.</DialogContentText>
          <Formik
            onSubmit={
              initialFormValues._id
                ? (values, actions) => {
                    handleUpdateRole(values)
                  }
                : (values, actions) => {
                    handleCreateRole(values)
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
                  <Field type="hidden" id="email" name="email" value={values.email} />

                  <TextField
                    fullWidth
                    autoFocus
                    autoComplete="off"
                    margin="dense"
                    name="name"
                    id="name"
                    value={values.name}
                    label="Name"
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
                    name="description"
                    id="description"
                    value={values.description}
                    label="Description"
                    type="text"
                    variant="outlined"
                    sx={{ gridColumn: 'span 4' }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  {/* Permissions */}
                  <Box>
                    <FormControl>
                      <FormGroup>
                        <FormControlLabel control={<Checkbox />} label="Create a new user." />
                        <FormControlLabel control={<Checkbox />} label="Delete user/s." />
                        <FormControlLabel control={<Checkbox />} label="Update/Edit a user." />
                      </FormGroup>
                    </FormControl>
                  </Box>
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
export default RoleForm
