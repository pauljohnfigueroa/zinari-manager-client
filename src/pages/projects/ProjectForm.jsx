/* 
The ProjectForm.jsx component is used on both create and update Project.

Components

*/
import { useState, useEffect } from 'react'

import { Formik, Form, Field } from 'formik'
// import * as yup from 'yup'

/* Redux */
import { useSelector, useDispatch } from 'react-redux'
import { createProject, updateProject, addProjectFormState } from '../../state/projectsSlice'
import { fetchTeams } from 'state/teamsSlice'

import dayjs from 'dayjs'

// MUI
import { Box, useMediaQuery, InputLabel, MenuItem, Select, FormControl, Chip, OutlinedInput } from '@mui/material'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

import FormikDatePicker from 'components/FormikDatePicker'

import { useTheme } from '@emotion/react'

/* *************** */
// select
const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}
/* *************** */

const ProjectForm = ({ formLabel, initFormValues, due, setDue }) => {
  const isNonMobile = useMediaQuery('(min-width: 600px)')
  const theme = useTheme()
  const [error, setError] = useState()
  const [value, setValue] = useState()

  const formState = useSelector(state => state.project.formState)
  const token = useSelector(state => state.auth.token)
  const teams = useSelector(state => state.team.teams)
  const dispatch = useDispatch()


  // When we do record update, the date format will be in the saved ISO format similar to 2018-04-04T16:00:00.000Z
  // To enable the Update form to load the current record's date,
  // We first need to convert the ISO format date to dayjs format.
  const initialFormValues = { ...initFormValues, dueDate: dayjs(initFormValues.dueDate) }

  /******************/
  /* Fetch Teams */
  useEffect(() => {
    const getTeams = async () => {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/teams`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      })
      const teams = await response.json()

      // Frontend
      /* Dispatch */
      dispatch(fetchTeams({ teams }))
    }
    getTeams()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /* ****** Chip ********* */

  /* 
    Convert the user object and get only the user's name 
    Make sure that you format this correctly like the array below.
    const memberNames = [
       'Oliver Hansen',
       'Van Henry',
    ]
  */
  const teamNames = teams.map(row => row.name)

  function getStyles(name, teamName, theme) {
    return {
      fontWeight:
        teamName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium
    }
  }
  /******************/

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
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(values)
    })
    // const updatedProject = await response.json()

    /* Dispatch */
    dispatch(updateProject({ project: values }))
    dispatch(addProjectFormState({ addProjectFormState: false }))
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
                  handleUpdateProject(values)
                }
                : (values, actions) => {
                  handleCreateProject(values)
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
                  {/* Due Date */}
                  <FormControl sx={{ gridColumn: 'span 2' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <FormikDatePicker
                        name="dueDate"
                        id="dueDate"
                        renderInput={params => <TextField {...params} label="Due Date" />}
                      />
                    </LocalizationProvider>
                  </FormControl>
                  {/* Select Teams */}
                  <FormControl sx={{ gridColumn: 'span 4' }}>
                    <InputLabel id="teams-label">Select Teams</InputLabel>
                    <Select
                      labelId="teams-label"
                      id="teams"
                      name="teams"
                      multiple
                      value={values.teams}
                      onChange={handleChange}
                      input={<OutlinedInput id="teams-input" label="Select Teams" />}
                      renderValue={selected => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map(value => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {teamNames.map(name => (
                        <MenuItem
                          key={name}
                          value={name}
                          style={getStyles(name, values.teams, theme)}
                        >
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
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
