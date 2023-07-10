/* 
The TasksGridWidget.jsx component is a datagrid where all tasks are listed.

Components

*/
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme } from '@emotion/react'

import { fetchTasks, addTaskFormState } from 'state/tasksSlice.js'
import TaskForm from 'components/forms/TaskForm.jsx'
import { Box, IconButton } from '@mui/material'
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import LinearProgress from '@mui/material/LinearProgress'

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

	/* Update task form */
	const showEditForm = row => {
		dispatch(addTaskFormState({ open: true }))
		setInitFormValues(row)
	}

	/* grid columns */
	const columns = [
		{
			field: '_id',
			headerName: 'ID'
		},
		{
			field: 'owner',
			headerName: 'Owner',
			flex: 1
		},
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
			field: 'category',
			headerName: 'Category',
			flex: 1
		},
		{
			field: 'action',
			headerName: 'Action',
			flex: 1,
			renderCell: rowdata => {
				return (
					<Box>
						<IconButton onClick={() => showEditForm(rowdata.row)}>
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
		</Box>
	)
}

export default TasksGridWidget
