/* 
The Tasks.jsx component serves as the dashboard page for Tasks.

Components
  - TasksGridWidget.jsx
  - TaskForm.jsx
*/
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { Box, Stack, Typography } from '@mui/material'
import Button from '@mui/material/Button'

import { addTaskFormState, deleteTasks } from '../../state/tasksSlice'

import dayjs from 'dayjs'

import TasksGridWidget from 'widgets/TasksGridWidget.jsx'
import TaskForm from '../../components/forms/TaskForm'

import { useTheme } from '@emotion/react'

import { tokens } from '../../theme.js'
// import FlexBetween from 'components/FlexBetween.jsx'

const Tasks = () => {
	const theme = useTheme()
	const colors = tokens(theme.palette.mode)

	// const [due, setDue] = useState()

	const dispatch = useDispatch()
	// const user = useSelector(state => state.auth.user)
	const token = useSelector(state => state.auth.token)
	const open = useSelector(state => state.task.open)
	const checkedIds = useSelector(state => state.datagrid.checkedIds)

	// Create/Update Form
	const initialValues = {
		_id: null,
		// email: user.email,
		title: '',
		description: '',
		project: '',
		team: '',
		priority: '',
		owner: '',
		perspective: '',
		dueDate: dayjs().add(0, 'day')
	}
	const [initFormValues, setInitFormValues] = useState(initialValues)

	/* open form */
	const openAddTaskForm = () => {
		setInitFormValues(initialValues)
		dispatch(addTaskFormState({ open: true }))
	}

	/* delete tasks */
	const handleDeleteTasks = async () => {
		// Backend
		//console.log('checkedIds', checkedIds)
		checkedIds.map(async id => {
			await fetch(`${process.env.REACT_APP_SERVER_URL}/tasks/${id}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`
				}
			})
		})

		dispatch(deleteTasks({ checkedIds }))
	}

	return (
		<Box sx={{ p: '1rem 5%' }}>
			{open && (
				<TaskForm
					formLabel={initFormValues._id ? 'Update Task' : 'New Task'}
					initFormValues={initFormValues}
				/>
			)}
			<Typography
				sx={{
					color: colors.primary.main,
					fontSize: '2rem',
					fontWeight: '700',
					letterSpacing: '2px'
				}}
			>
				Tasks
			</Typography>
			<Typography
				sx={{
					color: colors.primary[300],
					fontSize: '0.9rem',
					letterSpacing: '1px',
					margin: '10px 0'
				}}
			>
				The table below shows the tasks that belong to you.
			</Typography>
			<Box>
				<Box m="10px 0 0 0">
					<Stack spacing={2} direction="row">
						<Button onClick={openAddTaskForm} variant="contained">
							Add Task
						</Button>
						<Button
							disabled={checkedIds.length ? false : true}
							onClick={handleDeleteTasks}
							variant="outlined"
						>
							Delete Selected
						</Button>
					</Stack>
				</Box>
				<Box m="10px 0 0 0">
					<TasksGridWidget initFormValues={initFormValues} setInitFormValues={setInitFormValues} />
				</Box>
			</Box>
		</Box>
	)
}

export default Tasks
