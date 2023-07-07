/* 
The TeamForm.jsx component is used on both create and update Team.
*/
// import { useEffect } from 'react'
import { Formik, Form } from 'formik'
// import * as yup from 'yup'

import { useSelector, useDispatch } from 'react-redux'
import { createTeam, updateTeam, addTeamFormState } from '../../state/teamsSlice'

// MUI
import {
	Box,
	useMediaQuery,
	InputLabel,
	MenuItem,
	Select,
	FormControl,
	Chip,
	Avatar
} from '@mui/material'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import DialogActions from '@mui/material/DialogActions'
import OutlinedInput from '@mui/material/OutlinedInput'

import { useTheme } from '@emotion/react'

import DialogBox from 'components/dialog/DialogBox'
import useFetchUsers from 'hooks/useFetchUsers'

/* Mui Select MenuProps */
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
/* End Mui Select */

const TeamForm = ({ formLabel, initFormValues }) => {
	const isNonMobile = useMediaQuery('(min-width: 600px)')
	const theme = useTheme()

	const open = useSelector(state => state.team.open)
	const user = useSelector(state => state.auth.user)
	const token = useSelector(state => state.auth.token)

	const [users, error] = useFetchUsers()
	const dispatch = useDispatch()

	let initialFormValues = initFormValues
	// let teamMembersIds = []
	let teamMembers

	// if we are updating a team
	if (initFormValues.teamMembers) {
		teamMembers = initFormValues.teamMembers.map(
			teamMember =>
				`${teamMember._id}|${teamMember.firstName} ${teamMember.lastName}|${teamMember.photo}`
		)
		// update
		initialFormValues = { ...initialFormValues, teamMembers }
		// teamMembersIds = initFormValues.teamMembers.map(teamMember => teamMember._id)
	}

	//console.log('initialFormValues', initialFormValues)

	/* Mui Chip */
	/* 
		Convert the user object and get only the user's name 
		Make sure that you format this correctly like the array below.
		
		const memberNames = [
			'Oliver Hansen', 	// Do not use arrays or any referenced types for the values.
			'Van Henry', 		// string, number, or boolean only
		]
  	*/
	const memberNames = users.map(
		user => `${user._id}|${user.firstName} ${user.lastName}|${user.photo}`
	)
	console.log('memberNames', memberNames)

	function getStyles(name, personName, theme) {
		return {
			fontWeight:
				personName.indexOf(name) === -1
					? theme.typography.fontWeightRegular
					: theme.typography.fontWeightMedium
		}
	}
	/* End Mui chip */

	/* Close form dialog */
	const handleClose = (event, reason) => {
		if (reason !== 'backdropClick') {
			dispatch(addTeamFormState({ open: false }))
		}
	}

	/* Create Team handler*/
	const handleCreateTeam = async values => {
		//console.log('values', values)

		const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/teams`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({ ...values, leader: user._id })
		})
		const newTeam = await response.json()
		/* 
		The response from the above fetch() returns an array with one object.
		The object is formatted in the backend to conform to the Team's datagrid shape.
		We access the object using the index [0] 
		*/
		dispatch(createTeam({ team: newTeam[0] }))
		dispatch(addTeamFormState({ open: false }))
	}

	/* Update team handler */
	const handleUpdateTeam = async values => {
		//console.log(values)
		// Update item from the database - Backend
		const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/teams/${values._id}`, {
			method: 'PATCH',
			headers: {
				'Content-type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(values)
		})
		const updatedTeam = await response.json()

		dispatch(updateTeam({ team: updatedTeam[0] }))
		dispatch(addTeamFormState({ open: false }))
	}

	return (
		<div>
			{error && <div>{error}</div>}
			<DialogBox
				handleClose={handleClose}
				formLabel={formLabel}
				open={open}
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
										id={initialFormValues._id ? 'teamMembers' : 'members'}
										name={initialFormValues._id ? 'teamMembers' : 'members'}
										multiple
										value={initialFormValues._id ? values.teamMembers : values.members}
										onChange={handleChange}
										input={<OutlinedInput id="members-input" label="Select Members" />}
										/* Selected Items */
										renderValue={selected => (
											// console.log('renderValue selected', selected)
											// console.log('renderValue values.teamMembers', values.teamMembers)
											<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.4 }}>
												{selected.map(
													value =>
														value && (
															<Chip
																key={value.split('|')[0]} // _id
																label={value.split('|')[1]} // full name
																avatar={
																	<Avatar
																		alt={value.split('|')[1]} // full name
																		src={`/assets/images/${value.split('|')[2]}`} // photo
																	/>
																}
															/>
														)
												)}
											</Box>
										)}
										MenuProps={MenuProps}
									>
										{/* Drop down items */}
										{memberNames.map(member => (
											<MenuItem
												key={member.split('|')[0]} // [0] is _id, [1] is full name
												value={member} // member is an Array()
												style={getStyles(
													member[0],
													initialFormValues._id ? values.teamMembers : values.members,
													theme
												)}
											>
												<Box sx={{ display: 'flex', alignItems: 'center' }}>
													<Avatar
														src={`/assets/images/${member.split('|')[2]}`}
														sx={{ height: 24, width: 24, margin: '0 4px' }}
													/>
													{member.split('|')[1]}
												</Box>
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
