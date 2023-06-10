/* The TaskForm.jsx component is used on both create and update Task.*/
import { useEffect, useState, useCallback } from 'react'
import { Formik, Form, Field } from 'formik'
// import * as yup from 'yup'

import { useSelector, useDispatch } from 'react-redux'
import { createTask, updateTask, addTaskFormState } from '../../state/tasksSlice'

// MUI
import { Box, useMediaQuery, InputLabel, MenuItem, Select, FormControl } from '@mui/material'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import DialogActions from '@mui/material/DialogActions'

import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

import FormikDatePicker from 'components/FormikDatePicker'

import DialogBox from 'components/dialog/DialogBox'

const TaskForm = ({ formLabel, initFormValues }) => {
	const isNonMobile = useMediaQuery('(min-width: 600px)')
	const [error, setError] = useState([])
	const [teams, setTeams] = useState([])

	const formState = useSelector(state => state.task.formState)
	const token = useSelector(state => state.auth.token)
	const user = useSelector(state => state.auth.user)
	const dispatch = useDispatch()

	const initialFormValues = { ...initFormValues, dueDate: dayjs(initFormValues.dueDate) }

	const handleClose = (event, reason) => {
		if (reason !== 'backdropClick') {
			dispatch(addTaskFormState({ formState: false }))
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
		dispatch(addTaskFormState({ addTaskFormState: false }))
	}

	/* Update task handler */

	const handleUpdateTask = async values => {
		const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/tasks/${values._id}`, {
			method: 'PATCH',
			headers: {
				'Content-type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({ ...values, userId: user._id })
		})

		dispatch(updateTask({ task: values }))
		dispatch(addTaskFormState({ addTaskFormState: false }))
	}

	/* fetch teams */
	useEffect(() => {
		const getTeams = async () => {
			const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/teams`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`
				}
			})
				.then(async response => {
					setTeams(await response.json())
				})
				.catch(error => {
					console.log(error)
				})
		}
		getTeams()
	}, [])

	console.log('teams', teams)

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
								<FormControl sx={{ gridColumn: 'span 1' }} required>
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
								</FormControl>

								{/* Team */}
								<FormControl sx={{ gridColumn: 'span 1' }} required>
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
								</FormControl>

								{/* Team */}
								<FormControl sx={{ gridColumn: 'span 1' }} required>
									<InputLabel id="owner-label">Task Owner</InputLabel>
									<Select
										labelId="owner-label"
										name="owner"
										id="owner"
										value={values.owner}
										label="Owner"
										onChange={handleChange}
										onBlur={handleBlur}
									>
										<MenuItem value="User 1">User 1</MenuItem>
										<MenuItem value="User 2">User 2</MenuItem>
										<MenuItem value="User 3">User 3</MenuItem>
									</Select>
								</FormControl>

								{/* Perspective */}
								<FormControl sx={{ gridColumn: 'span 2' }} required>
									<InputLabel id="perspective-label">Perspective</InputLabel>
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

								{/* Priority */}
								<FormControl sx={{ gridColumn: 'span 1' }} required>
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

								{/*  Due date */}
								<FormControl sx={{ gridColumn: 'span 1' }}>
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
