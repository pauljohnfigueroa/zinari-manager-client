import { useState } from 'react'

import { Formik, Form } from 'formik'
// import * as yup from 'yup'
import { Box, useMediaQuery, InputLabel, MenuItem, Select, FormControl } from '@mui/material'

import { useSelector, useDispatch } from 'react-redux'
import createTask from '../../state/redux'

import { addTaskFormState } from '../../state/redux'

// MUI
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

const TaskForm = ({ formLabel }) => {
  const isNonMobile = useMediaQuery('(min-width: 600px)')

  const [error, setError] = useState()
  const [formValues, setFormValues] = useState()
  const initFormValues = {}

  const formState = useSelector(state => state.formState)
  const token = useSelector(state => state.token)
  const dispatch = useDispatch()

  const handleClose = () => {
    console.log('handleClose clicked')
    dispatch(addTaskFormState({ formState: false }))
  }

  const handleCreateTask = async values => {
    // await registerUser(values.email, values.name, values.password, values.phone, values.roles)
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
      <Dialog open={addTaskFormState} onClose={handleClose} fullWidth>
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
                  gap="30px"
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
