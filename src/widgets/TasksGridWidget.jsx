/* 
The TasksGridWidget.jsx component is a datagrid where all tasks are listed.

Components

*/
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme } from '@emotion/react'

import { fetchTasks, addTaskFormState } from 'state/tasksSlice.js'
import TaskForm from 'components/forms/TaskForm.jsx'
import { Box, IconButton } from '@mui/material'
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import LinearProgress from '@mui/material/LinearProgress'

import TasksDrawer from 'pages/tasks/TasksDrawer.jsx'

import { setCheckedIds } from 'state/datagridSlice.js'

import { tokens } from '../theme.js'

const TasksGridWidget = ({ initFormValues, setInitFormValues }) => {
	const theme = useTheme()
	const colors = tokens(theme.palette.mode)

	const dispatch = useDispatch()
	const tasks = useSelector(state => state.task.tasks)
	const open = useSelector(state => state.task.open)
	const token = useSelector(state => state.auth.token)
	const user = useSelector(state => state.auth.user)

	const [currentTeam, setCurrentTeam] = useState([])

	const [openTaskDetailDialog, setOpenTaskDetailDialog] = useState(false)

	/* fetch tasks */
	useEffect(() => {
		const getTasks = async () => {
			const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/tasks/user`, {
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ userId: user._id })
			})
			const tasks = await response.json()
			dispatch(fetchTasks({ tasks }))
		}
		getTasks()
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	// console.log('TaskForm initFormValues.team', initFormValues.team)

	/* Update task form */
	const showEditForm = async row => {
		const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/teams/${row.team}/members`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		})
		const teamMembers = await response.json()
		console.log('teamMembers', teamMembers)
		setCurrentTeam(teamMembers)
		setInitFormValues(row)
		dispatch(addTaskFormState({ open: true }))
	}

	const showTaskDrawer = row => {
		setInitFormValues(row)
		setOpenTaskDetailDialog(!openTaskDetailDialog)
	}

	/* grid columns */
	const columns = [
		{
			field: '_id',
			headerName: 'ID'
		},
		// {
		// 	field: 'owner',
		// 	headerName: 'Owner',
		// 	flex: 1
		// },
		{
			field: 'title',
			headerName: 'Title',
			flex: 1
		},
		{
			field: 'description',
			headerName: 'Description',
			flex: 1
		},
		{
			field: 'project',
			headerName: 'Project',
			flex: 1
		},
		{
			field: 'team',
			headerName: 'Team',
			flex: 1
		},
		{
			field: 'perspective',
			headerName: 'Perspective',
			flex: 1
		},
		{
			field: 'status',
			headerName: 'Status',
			flex: 1
		},
		{
			field: 'dueDate',
			headerName: 'Due Date',
			flex: 1
		},
		{
			field: 'action',
			headerName: 'Action',
			flex: 1,
			renderCell: rowData => {
				return (
					<Box>
						{/* <IconButton onClick={() => showEditForm(rowData.row)}>
							<ModeEditOutlineOutlinedIcon />
						</IconButton> */}
						<IconButton onClick={() => showTaskDrawer(rowData.row)}>
							<ModeEditOutlineOutlinedIcon />
						</IconButton>
					</Box>
				)
			}
		}
	]

	return (
		<Box height="60vh">
			{/* used by the edit button */}
			{open && (
				<TaskForm
					formLabel={initFormValues._id ? 'Update Task' : 'New Task'}
					initFormValues={initFormValues}
					currentTeam={currentTeam}
				/>
			)}

			{/* datagrid */}
			<DataGrid
				initialState={{
					columns: {
						columnVisibilityModel: {
							// Hide these columns by default, the other columns will remain visible
							_id: false
						}
					}
				}}
				getRowId={row => row._id}
				sx={{
					backgroundColor: colors.grey[800],
					'& .MuiDataGrid-row:hover': {
						color: colors.grey[400],
						backgroundColor: colors.primary.main
					}
				}}
				slots={{
					toolbar: GridToolbar,
					loadingOverlay: LinearProgress
				}}
				rows={tasks ? tasks : []}
				columns={columns}
				checkboxSelection
				disableSelectionOnClick
				disableRowSelectionOnClick
				onRowSelectionModelChange={checkedIds => {
					// Pass the checked row ids to a redux state
					dispatch(setCheckedIds({ checkedIds }))
				}}
			/>
			{openTaskDetailDialog && (
				<TasksDrawer
					openTaskDetailDialog={openTaskDetailDialog}
					setOpenTaskDetailDialog={setOpenTaskDetailDialog}
					initFormValues={initFormValues}
				/>
			)}
		</Box>
	)
}

export default TasksGridWidget
