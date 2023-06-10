/* The TaskForm.jsx component is used on both create and update Task.*/
import { useState } from 'react'
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
	const [error, setError] = useState()

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
								gridTemplateColumns="repeat(4, minmax(0, 1fr))"
								sx={{
									'& > div': { gridColumn: isNonMobile ? undefined : 'span 4' }
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
								{/* Team */}
								<FormControl sx={{ gridColumn: 'span 2' }} required>
									<InputLabel id="priority-label">Team</InputLabel>
									<Select
										labelId="priority-label"
										name="priority"
										id="priority"
										value={values.priority}
										label="Priority"
										onChange={handleChange}
										onBlur={handleBlur}
									>
										<MenuItem value="Team 1">Team 1</MenuItem>
										<MenuItem value="Team 2">Team 2</MenuItem>
										<MenuItem value="Team 3">Team 3</MenuItem>
									</Select>
								</FormControl>

								{/* Team */}
								<FormControl sx={{ gridColumn: 'span 2' }} required>
									<InputLabel id="priority-label">Task Owner</InputLabel>
									<Select
										labelId="priority-label"
										name="priority"
										id="priority"
										value={values.priority}
										label="Priority"
										onChange={handleChange}
										onBlur={handleBlur}
									>
										<MenuItem value="USer 1">User 1</MenuItem>
										<MenuItem value="User 2">User 2</MenuItem>
										<MenuItem value="User 3">User 3</MenuItem>
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
										<MenuItem value="Low">Low</MenuItem>
										<MenuItem value="Normal">Normal</MenuItem>
										<MenuItem value="Urgent">Urgent</MenuItem>
									</Select>
								</FormControl>
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
