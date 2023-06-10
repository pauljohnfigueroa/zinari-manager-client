/* 
The TeamForm.jsx component is used on both create and update Team.
*/
// import { useEffect } from 'react'
import { Formik, Form } from 'formik'
// import * as yup from 'yup'

import { useSelector, useDispatch } from 'react-redux'
import { createTeam, updateTeam, addTeamFormState } from '../../state/teamsSlice'
// import { fetchUsers } from '../../state/usersSlice'

// MUI
import { Box, useMediaQuery, InputLabel, MenuItem, Select, FormControl, Chip } from '@mui/material'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import DialogActions from '@mui/material/DialogActions'
import OutlinedInput from '@mui/material/OutlinedInput'

import { useTheme } from '@emotion/react'

import DialogBox from 'components/dialog/DialogBox'
import useFetchUsers from 'hooks/useFetchUsers'

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
	const theme = useTheme()

	const formState = useSelector(state => state.team.formState)
	const user = useSelector(state => state.auth.user)
	const token = useSelector(state => state.auth.token)

	const [users, error] = useFetchUsers(process.env.REACT_APP_SERVER_URL)

	const dispatch = useDispatch()

	// Just to make the variable naming consistent with other forms
	const initialFormValues = initFormValues

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

	/* ****** End Chip ********* */

	const handleClose = (event, reason) => {
		if (reason !== 'backdropClick') {
			/* DISPATCH */
			dispatch(addTeamFormState({ formState: false }))
		}
	}

	/* Create a team handler*/
	const handleCreateTeam = async values => {
		const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/teams`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({ ...values, leader: user._id })
		})
		const newTeam = await response.json()

		/* DISPATCH */
		dispatch(createTeam({ team: newTeam }))
		dispatch(addTeamFormState({ addTeamFormState: false }))
	}

	/* Update a team handler*/
	const handleUpdateTeam = async values => {
		console.log(values)
		// Update item from the database - Backend
		await fetch(`${process.env.REACT_APP_SERVER_URL}/teams/${values._id}`, {
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
			<DialogBox
				handleClose={handleClose}
				formLabel={formLabel}
				formState={formState}
				fullWidth={true}
				maxWidth="sm"
				requiredFields="Please fill up all the required ( * ) fields."
			>
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
								{/* <Field type="hidden" id="leader" name="leader" value={values.email} /> */}

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
			</DialogBox>
		</div>
	)
}
export default TeamForm
