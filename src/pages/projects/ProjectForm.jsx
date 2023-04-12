/* 
The ProjectForm.jsx component is used on both create and update Project.

Components

*/
import { useState } from 'react'

import { Formik, Form, Field } from 'formik'
// import * as yup from 'yup'

import { useSelector, useDispatch } from 'react-redux'
import { createProject, updateProject, addProjectFormState } from '../../state/projectsSlice'

// MUI
import { Box, useMediaQuery, InputLabel, MenuItem, Select, FormControl } from '@mui/material'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

// import dayjs from 'dayjs'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

const ProjectForm = ({ formLabel, initFormValues, due, setDue }) => {
  const isNonMobile = useMediaQuery('(min-width: 600px)')
  // const [formValues, setFormValues] = useState()
  const [error, setError] = useState()

  const [value, setValue] = useState()

  const formState = useSelector(state => state.project.formState)
  const token = useSelector(state => state.auth.token)
  const dispatch = useDispatch()

  const handleClose = (event, reason) => {
    if (reason !== 'backdropClick') {
      /* Dispatch */
      dispatch(addProjectFormState({ formState: false }))
      // setDue(dayjs().add(0, 'day'))
    }
  }

  const handleCreateProject = async values => {
    // await registerUser(values.email, values.name, values.password, values.phone, values.roles)
    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(values)
    })
    const newProject = await response.json()

    /* Dispatch */
    dispatch(createProject({ project: newProject }))
    dispatch(addProjectFormState({ addProjectFormState: false }))
  }

  const handleUpdateProject = async values => {
    console.log(values)
    // Update item from the database - Backend
    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/projects/${values._id}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(values)
    })
    // const updatedProject = await response.json()

    /* Dispatch */
    dispatch(updateProject({ project: values }))
    dispatch(addProjectFormState({ addProjectFormState: false }))

    // check for errors
    // if (!response.ok) {
    //   setError(updatedProject.error)
    // }
    // Remove the item/s from the DataGrid - Frontend
    // dispatch()
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
              initFormValues._id
                ? (values, actions) => {
                    handleUpdateProject(values)
                  }
                : (values, actions) => {
                    handleCreateProject(values)
                  }
            }
            initialValues={initFormValues}
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
                    name="title"
                    id="title"
                    value={values.title}
                    label="Title"
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
                  <FormControl sx={{ gridColumn: 'span 2' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Due Date"
                        name="dueDate"
                        id="dueDate"
                        disablePast
                        defaultValue={due}
                        value={value}
                        onChange={newValue => {
                          setValue(newValue)
                        }}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </Box>

                <DialogActions>
                  <Button sx={{ minWidth: 100 }} onClick={handleClose} variant="outlined">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    sx={{ minWidth: 100 }}
                    variant="contained"
                    // onClick={values._id ? () => setFormValues(values) : undefined}
                  >
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
export default ProjectForm
