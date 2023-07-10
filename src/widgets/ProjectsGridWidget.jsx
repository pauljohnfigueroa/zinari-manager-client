/* The ProjectsGridWidget.jsx component is a datagrid where all Projects are listed. */

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme } from '@emotion/react'

import ProjectForm from 'components/forms/ProjectForm.jsx'
import { Box, IconButton } from '@mui/material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import LinearProgress from '@mui/material/LinearProgress'
import EditNoteIcon from '@mui/icons-material/EditNote'

import { fetchProjects } from 'state/projectsSlice.js'

/* Drawer */
import ProjectsDrawer from 'pages/projects/ProjectsDrawer.jsx'

/* Dialog */
import DialogBox from 'components/dialog/DialogBox'

import { setCheckedIds } from 'state/datagridSlice.js'
import { tokens } from '../theme.js'
import dayjs from 'dayjs'

// const Transition = forwardRef(function Transition(props, ref) {
// 	return <Slide direction="right" ref={ref} {...props} />
// })

const ProjectsGridWidget = ({ initFormValues, setInitFormValues }) => {
	const theme = useTheme()
	const colors = tokens(theme.palette.mode)
	// const [projData, setProjData] = useState()
	const [projDetailDialog, setProjDetailDialog] = useState(false)

	const dispatch = useDispatch()
	const projects = useSelector(state => state.project.projects)
	const open = useSelector(state => state.project.open)
	const token = useSelector(state => state.auth.token)
	const user = useSelector(state => state.auth.user)

	/* Update project form */
	// const showEditForm = row => {
	// 	dispatch(addProjectFormState({ open: true }))
	// 	setInitFormValues(row)
	// }

	const handleRowClick = row => {
		setInitFormValues(row)
		setProjDetailDialog(!projDetailDialog)
		// setProjData(`Project Title: ${row}`)
	}

	const handleClose = () => {
		setProjDetailDialog(false)
	}

	/* fetch projects */
	useEffect(() => {
		// Backend
		const getProjects = async () => {
			const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/users/projects`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ userId: user._id })
			})
			const projects = await response.json()

			dispatch(fetchProjects({ projects }))
		}
		getProjects()
		console.log('ProjectGridWidget fetch projects useEffect was called.')
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	/* Mui Datagrid columns */
	const columns = [
		{
			field: '_id',
			headerName: 'ID'
		},
		{
			field: 'title',
			headerName: 'Title'
		},
		{
			field: 'description',
			headerName: 'Description',
			flex: 1
		},
		{
			field: 'dueDate',
			headerName: 'Due Date',
			valueFormatter: params => dayjs(params?.value).format('LL')
		},
		{
			field: 'projTeams',
			headerName: 'Teams',
			renderCell: rowData => {
				if (rowData.row?.projTeams.length > 0) {
					return (
						<p key={rowData.row.projTeams[0]._id}>{rowData.row.projTeams.map(team => team.name)}</p>
					)
				}
			}
		},
		{
			field: 'projManager',
			headerName: 'Manager',
			renderCell: rowData => {
				if (rowData.row?.projManager.length > 0) {
					return <p key={rowData.row.projManager[0]._id}>{rowData.row.projManager[0].firstName}</p>
				}
			}
		},
		{
			field: 'action',
			headerName: 'Action',
			renderCell: rowdata => {
				return (
					<Box>
						{/* <IconButton onClick={() => showEditForm(rowdata.row)}> */}
						<IconButton onClick={() => handleRowClick(rowdata.row)}>
							<EditNoteIcon />
						</IconButton>
					</Box>
				)
			}
		}
	]

	return (
		<Box height="60vh">
			{open && (
				<DialogBox
					handleClose={handleClose}
					formLabel={initFormValues._id ? 'Update Project' : 'New Project'}
					open={open}
					fullWidth={true}
					maxWidth="sm"
					requiredFields="Please fill up all the required ( * ) fields."
				>
					<ProjectForm
						// formLabel={initFormValues._id ? 'Update Project' : 'New Project'}
						initFormValues={initFormValues}
					/>
				</DialogBox>
			)}

			{/* DATAGRID */}
			<DataGrid
				initialState={{
					columns: {
						columnVisibilityModel: {
							// hidden columns
							_id: false
							// tasks: false
						}
					}
				}}
				getRowId={row => row._id}
				sx={{
					backgroundColor: colors.grey[800],
					'& .MuiDataGrid-row:hover': {
						color: colors.grey[400],
						backgroundColor: colors.primary.main,
						cursor: 'pointer'
					}
				}}
				slots={{
					toolbar: GridToolbar,
					loadingOverlay: LinearProgress
				}}
				rows={projects ? projects : []}
				columns={columns}
				checkboxSelection
				disableSelectionOnClick
				disableRowSelectionOnClick
				onRowSelectionModelChange={checkedIds => {
					// Pass the checked row ids to a redux state
					dispatch(setCheckedIds({ checkedIds }))
				}}
				// onRowClick={() => handleRowClick(rowdata.row)}
			/>
			{/* Drawer */}
			{projDetailDialog && (
				<ProjectsDrawer
					projDetailDialog={projDetailDialog}
					setProjDetailDialog={setProjDetailDialog}
					initFormValues={initFormValues}
				/>
			)}
		</Box>
	)
}

export default ProjectsGridWidget
