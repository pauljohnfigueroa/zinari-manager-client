/* 

The TeamForm.jsx component is used on both create and update Team.

*/
import { useEffect, useState } from 'react'

import { Formik, Form, Field } from 'formik'
// import * as yup from 'yup'

import { useSelector, useDispatch } from 'react-redux'
import { createTeam, updateTeam, addTeamFormState } from '../../state/teamsSlice'
import { fetchUsers } from '../../state/usersSlice'

import { useTheme } from '@emotion/react'

// MUI
import { Box, useMediaQuery, InputLabel, MenuItem, Select, FormControl, Chip } from '@mui/material'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import OutlinedInput from '@mui/material/OutlinedInput'

/* *************** */

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

const TeamForm = ({ formLabel, initFormValues }) => {
  const isNonMobile = useMediaQuery('(min-width: 600px)')
  // const [formValues, setFormValues] = useState()
  const [error, setError] = useState()
  const theme = useTheme()

  const [personName, setPersonName] = useState([])

  const formState = useSelector(state => state.team.formState)
  const token = useSelector(state => state.auth.token)
  const users = useSelector(state => state.user.users)
  const dispatch = useDispatch()

  // Just to make the variable naming consistent with other forms
  const initialFormValues = initFormValues

  /* Fetch Users */
  useEffect(() => {
    const getUsers = async () => {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/users`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      })
      const users = await response.json()

      // Frontend
      /* Dispatch */
      dispatch(fetchUsers({ users }))
    }
    getUsers()
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
  const memberNames = users.map(row =>
    `${row.firstName} ${row.lastName} ${row.extName ? row.extName : ''}`.trim()
  )

  function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium
    }
  }

  const handleChangeX = event => {
    const {
      target: { value }
    } = event
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    )
  }

  /* ****** End Chip ********* */

  const handleClose = (event, reason) => {
    if (reason !== 'backdropClick') {
      /* DISPATCH */
      dispatch(addTeamFormState({ formState: false }))
    }
  }

  const handleCreateTeam = async values => {
    // await registerUser(values.email, values.name, values.password, values.phone, values.roles)
    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/teams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(values)
    })
    const newTeam = await response.json()

    /* DISPATCH */
    dispatch(createTeam({ team: newTeam }))
    dispatch(addTeamFormState({ addTeamFormState: false }))
  }

  const handleUpdateTeam = async values => {
    console.log(values)
    // Update item from the database - Backend
    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/teams/${values._id}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(values)
    })

    /* DISPATCH */
    dispatch(updateTeam({ team: values }))
    dispatch(addTeamFormState({ addTeamFormState: false }))
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
                  handleUpdateTeam(values)
                }
                : (values, actions) => {
                  handleCreateTeam(values)
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
                  <Field type="hidden" id="leader" name="leader" value={values.email} />

                  <TextField
                    fullWidth
                    autoFocus
                    autoComplete="off"
                    margin="dense"
                    name="name"
                    id="name"
                    value={values.name}
                    label="Team Name"
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
                    label="Description/Purpose"
                    type="text"
                    variant="outlined"
                    sx={{ gridColumn: 'span 4' }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />

                  {/* Team Members */}
                  <FormControl sx={{ gridColumn: 'span 4' }}>
                    <InputLabel id="members-label">Select Members</InputLabel>
                    <Select
                      labelId="members-label"
                      id="members"
                      name="members"
                      multiple
                      value={values.members}
                      onChange={handleChange}
                      input={<OutlinedInput id="members-input" label="Members" />}
                      renderValue={selected => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map(value => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {memberNames.map(name => (
                        <MenuItem
                          key={name}
                          value={name}
                          style={getStyles(name, values.members, theme)}
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
export default TeamForm
