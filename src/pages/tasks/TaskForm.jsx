import { useState } from 'react'

import { Formik, Form } from 'formik'
// import * as yup from 'yup'

import dayjs from 'dayjs'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

import { useSelector, useDispatch } from 'react-redux'
import { createTask, addTaskFormState } from '../../state/tasksSlice'

// MUI
import { Box, useMediaQuery, InputLabel, MenuItem, Select, FormControl } from '@mui/material'
import { SelectChangeEvent } from '@mui/material/Select'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

const TaskForm = ({ formLabel }) => {
  const isNonMobile = useMediaQuery('(min-width: 600px)')
  const [formValues, setFormValues] = useState()
  const [error, setError] = useState()

  const initFormValues = {
    title: '',
    description: '',
    priority: '',
    category: '',
    duedate: ''
  }

  const formState = useSelector(state => state.formState)
  const token = useSelector(state => state.token)
  const dispatch = useDispatch()

  const handleClose = (event, reason) => {
    if (reason !== 'backdropClick') {
      /* Dispatch */
      dispatch(addTaskFormState({ formState: false }))
    }
  }

  const handleCreateTask = async values => {
    // await registerUser(values.email, values.name, values.password, values.phone, values.roles)
    /* Dispatch */
    dispatch(createTask({ task: values }))
    dispatch(addTaskFormState({ formState: false }))
  }

  const handleUpdateUser = async values => {
    // Delete item/s from the database - Backend
    const response = await fetch(`${process.env.REACT_APP_API_SERVER}/tasks/${values._id}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(values)
    })

    const json = await response.json()

    // check for errors
    if (!response.ok) {
      setError(json.error)
    }
    // Remove the item/s from the DataGrid - Frontend
    dispatch()
  }

  return (
    <div>
      {error && <div>{error}</div>}
      <Dialog fullWidth open={addTaskFormState} onClose={handleClose}>
        <DialogTitle>{formLabel}</DialogTitle>
        <DialogContent>
          <DialogContentText>Please fill up all the required ( * ) fields.</DialogContentText>
          <Formik
            onSubmit={
              initFormValues._id
                ? (values, actions) => {
                    handleUpdateUser(values)
                  }
                : (values, actions) => {
                    handleCreateTask(values)
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
                      id="priority"
                      value={values.priority}
                      label="Priority"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <MenuItem value={1}>Low</MenuItem>
                      <MenuItem value={2}>Normal</MenuItem>
                      <MenuItem value={3}>Urgent</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl sx={{ gridColumn: 'span 2' }} required>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                      labelId="category-label"
                      id="category"
                      value={values.category}
                      label="Category"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <MenuItem value={1}>Financial</MenuItem>
                      <MenuItem value={2}>Customer</MenuItem>
                      <MenuItem value={3}>Internal Business</MenuItem>
                      <MenuItem value={3}>Learning and Growth</MenuItem>
                    </Select>
                  </FormControl>

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      defaultValue={dayjs().add(0, 'day')}
                      disablePast
                      sx={{ gridColumn: 'span 2' }}
                      label="Due Date"
                    />
                  </LocalizationProvider>
                </Box>

                <DialogActions>
                  <Button sx={{ minWidth: 100 }} onClick={handleClose} variant="outlined">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    sx={{ minWidth: 100 }}
                    variant="contained"
                    onClick={values._id ? () => setFormValues(values) : undefined}
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
