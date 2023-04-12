/* 

The TaskForm.jsx component is used on both create and update Task.

*/
import { useState } from 'react'

import { Formik, Form, Field } from 'formik'
// import * as yup from 'yup'

import { useSelector, useDispatch } from 'react-redux'
import { createTask, updateTask, addTaskFormState } from '../../state/tasksSlice'

// MUI
import { Box, useMediaQuery, InputLabel, MenuItem, Select, FormControl } from '@mui/material'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

import dayjs from 'dayjs'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

import FormikDatePicker from 'components/FormikDatePicker'

const TaskForm = ({ formLabel, initFormValues }) => {
  const isNonMobile = useMediaQuery('(min-width: 600px)')
  // const [formValues, setFormValues] = useState()
  const [error, setError] = useState()

  const formState = useSelector(state => state.task.formState)
  const token = useSelector(state => state.auth.token)
  const user = useSelector(state => state.auth.user)
  const dispatch = useDispatch()

  // When we do record update, the date format will be in the saved ISO format similar to 2018-04-04T16:00:00.000Z
  // To enable the Update form to load the current record's date,
  // We first need to convert the ISO format date to dayjs format.
  const initialFormValues = { ...initFormValues, dueDate: dayjs(initFormValues.dueDate) }

  const handleClose = (event, reason) => {
    if (reason !== 'backdropClick') {
      /* DISPATCH */
      dispatch(addTaskFormState({ formState: false }))
    }
  }

  const handleCreateTask = async values => {
    // await registerUser(values.email, values.name, values.password, values.phone, values.roles)
    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(values)
    })
    const newTask = await response.json()

    /* DISPATCH */
    dispatch(createTask({ task: newTask }))
    dispatch(addTaskFormState({ addTaskFormState: false }))
  }

  const handleUpdateTask = async values => {
    console.log(values)
    // Update item from the database - Backend
    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/tasks/${values._id}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(values)
    })

    /* DISPATCH */
    dispatch(updateTask({ task: values }))
    dispatch(addTaskFormState({ addTaskFormState: false }))
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
                    handleUpdateTask(values)
                  }
                : (values, actions) => {
                    handleCreateTask(values)
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
                  <FormControl sx={{ gridColumn: 'span 2' }} required>
                    <InputLabel id="priority-label">Priority</InputLabel>
                    <Select
                      labelId="priority-label"
                      name="priority"
                      id="priority"
                      value={values.priority}
                      label="Priority"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <MenuItem value="Low">Low</MenuItem>
                      <MenuItem value="Normal">Normal</MenuItem>
                      <MenuItem value="Urgent">Urgent</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl sx={{ gridColumn: 'span 2' }} required>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                      labelId="category-label"
                      name="category"
                      id="category"
                      value={values.category}
                      label="Category"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <MenuItem value="Financial">Financial</MenuItem>
                      <MenuItem value="Customer">Customer</MenuItem>
                      <MenuItem value="Internal Business Process">
                        Internal Business Process
                      </MenuItem>
                      <MenuItem value="Learning And Growth">Learning and Growth</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl sx={{ gridColumn: 'span 2' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <FormikDatePicker
                        name="dueDate"
                        id="dueDate"
                        disablePast
                        renderInput={params => (
                          <TextField
                            {...params}
                            value={values.dueDate ? 'hi' : 'hello'}
                            label="Due Date"
                          />
                        )}
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
export default TaskForm
