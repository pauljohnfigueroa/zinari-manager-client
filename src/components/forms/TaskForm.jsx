/* The TaskForm.jsx component is used on both create and update Task.*/
import { Formik, Form, Field } from 'formik'
// import * as yup from 'yup'

import { useSelector, useDispatch } from 'react-redux'
import { createTask, updateTask, addTaskFormState } from '../../state/tasksSlice'

// MUI
import { Box, useMediaQuery, InputLabel, MenuItem, Select, FormControl } from '@mui/material'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

// MUI
import { Chip, Avatar } from '@mui/material'
import DialogActions from '@mui/material/DialogActions'
import OutlinedInput from '@mui/material/OutlinedInput'

import { useTheme } from '@emotion/react'

import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

import FormikDatePicker from 'components/FormikDatePicker'

import DialogBox from 'components/dialog/DialogBox'

import useFetchTeams from 'hooks/useFetchTeams'

/* Mui Select MenuProps */
// Repeated code
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

const TaskForm = ({ formLabel, initFormValues, currentTeam }) => {
	const theme = useTheme()
	const isNonMobile = useMediaQuery(theme.breakpoints.up('md'))

	const [teams, error] = useFetchTeams()

	const open = useSelector(state => state.task.open)
	const token = useSelector(state => state.auth.token)
	const user = useSelector(state => state.auth.user)
	const dispatch = useDispatch()

	const initialFormValues = { ...initFormValues, dueDate: dayjs(initFormValues.dueDate) }

	/* Mui Chip */
	const memberNames = currentTeam.teamMembers.map(
		teamMember =>
			`${teamMember._id}|${teamMember.firstName} ${teamMember.lastName}|${teamMember.photo}`
	)
	console.log('memberNames', memberNames)

	// repeated code
	function getStyles(name, personName, theme) {
		return {
			fontWeight:
				personName.indexOf(name) === -1
					? theme.typography.fontWeightRegular
					: theme.typography.fontWeightMedium
		}
	}
	/* End Mui chip */

	const handleClose = (event, reason) => {
		if (reason !== 'backdropClick') {
			dispatch(addTaskFormState({ open: false }))
		}
	}

	/* Create task handler */

	const handleCreateTask = async values => {
		const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/tasks`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({ ...values, userId: user._id })
		})
		const newTask = await response.json()

		dispatch(createTask({ task: newTask }))
		dispatch(addTaskFormState({ open: false }))
	}

	/* Update task handler */

	const handleUpdateTask = async values => {
		await fetch(`${process.env.REACT_APP_SERVER_URL}/tasks/${values._id}`, {
			method: 'PATCH',
			headers: {
				'Content-type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({ ...values, userId: user._id })
		})

		dispatch(updateTask({ task: values }))
		dispatch(addTaskFormState({ open: false }))
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
								gridTemplateColumns="repeat(3, minmax(0, 1fr))"
								sx={{
									'& > div': { gridColumn: isNonMobile ? undefined : 'span 3' }
								}}
							>
								{/* <Field type="hidden" id="email" name="email" value={values.email} /> */}
								<Field type="hidden" id="project" name="project" value={values.project} />

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
									sx={{ gridColumn: 'span 3' }}
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
									sx={{ gridColumn: 'span 3' }}
									onChange={handleChange}
									onBlur={handleBlur}
									required
								/>

								{/* Project */}
								{/* <FormControl sx={{ gridColumn: 'span 1' }} required>
									<InputLabel id="project-label">Project</InputLabel>
									<Select
										labelId="project-label"
										name="project"
										id="project"
										value={values.project}
										label="project"
										onChange={handleChange}
										onBlur={handleBlur}
									>
										<MenuItem value="User 1">User 1</MenuItem>
										<MenuItem value="User 2">User 2</MenuItem>
										<MenuItem value="User 3">User 3</MenuItem>
									</Select>
								</FormControl> */}

								{/* Team */}
								{/* <FormControl sx={{ gridColumn: 'span 1' }} required>
									<InputLabel id="team-label">Team</InputLabel>
									<Select
										labelId="team-label"
										name="team"
										id="team"
										value={values.team}
										label="Team"
										onChange={handleChange}
										onBlur={handleBlur}
									>
										{teams && teams.map(team => <MenuItem value={team._id}>{team.name}</MenuItem>)}
									</Select>
								</FormControl> */}

								{/* Perspective */}
								<FormControl sx={{ gridColumn: 'span 2' }} required>
									<InputLabel id="perspective-label">Balance Scorecard Perspective</InputLabel>
									<Select
										labelId="perspective-label"
										name="perspective"
										id="perspective"
										value={values.perspective}
										label="Perspective"
										onChange={handleChange}
										onBlur={handleBlur}
									>
										<MenuItem value="Financial">Financial</MenuItem>
										<MenuItem value="Customer">Customer</MenuItem>
										<MenuItem value="Internal Business Process">Internal Business Process</MenuItem>
										<MenuItem value="Learning And Growth">Learning and Growth</MenuItem>
									</Select>
								</FormControl>

								{/* Owner */}
								{/* Team Members */}
								<FormControl sx={{ gridColumn: 'span 4' }}>
									<InputLabel id="members-label">Select Owner</InputLabel>
									<Select
										labelId="members-label"
										id="owner"
										name="owner"
										value={values.owner}
										onChange={handleChange}
										input={<OutlinedInput id="members-input" label="Select Owner" />}
										/* Selected Items */
										renderValue={selected => (
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
												style={getStyles(member[0], values.owner, theme)}
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

								{/* Priority */}
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
										<MenuItem value="low">Low</MenuItem>
										<MenuItem value="normal">Normal</MenuItem>
										<MenuItem value="high">High</MenuItem>
										<MenuItem value="urgent">Urgent</MenuItem>
										<MenuItem value="immediate">Immediate</MenuItem>
									</Select>
								</FormControl>

								{/*  Due date */}
								<FormControl sx={{ gridColumn: 'span 2' }}>
									<LocalizationProvider dateAdapter={AdapterDayjs}>
										<FormikDatePicker
											name="dueDate"
											id="dueDate"
											label="Due Date"
											renderInput={params => <TextField {...params} />}
										/>
									</LocalizationProvider>
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
export default TaskForm
