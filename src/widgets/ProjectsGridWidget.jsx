/* The ProjectsGridWidget.jsx component is a datagrid where all Projects are listed. */

import { useEffect, useState, forwardRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme } from '@emotion/react'

import { fetchProjects, addProjectFormState } from 'state/projectsSlice.js'
import ProjectForm from 'pages/projects/ProjectForm.jsx'
import { Box, IconButton } from '@mui/material'
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import LinearProgress from '@mui/material/LinearProgress'
import Alert from '@mui/material/Alert'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import ListItemText from '@mui/material/ListItemText'
import ListItem from '@mui/material/ListItem'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
// import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import Slide from '@mui/material/Slide'

import { setCheckedIds } from 'state/datagridSlice.js'

import { tokens } from '../theme.js'

import dayjs from 'dayjs'

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />
})

const ProjectsGridWidget = ({ initFormValues, setInitFormValues }) => {
	const theme = useTheme()
	const colors = tokens(theme.palette.mode)
	const [rowMessage, setRowMessage] = useState()
	const [projDetailDialog, setProjDetailDialog] = useState(false)

	const dispatch = useDispatch()
	const projects = useSelector(state => state.project.projects)
	const open = useSelector(state => state.project.open)
	const token = useSelector(state => state.auth.token)
	const user = useSelector(state => state.auth.user)

	const handleRowClick = params => {
		setProjDetailDialog(!projDetailDialog)
		setRowMessage(`Show the details page for ${params.row.name}`)
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

			console.log('projects', projects)

			dispatch(fetchProjects({ projects }))
		}
		getProjects()
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	/* Update project form */
	const showEditForm = row => {
		dispatch(addProjectFormState({ open: true }))
		setInitFormValues(row)
	}

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
			{open && (
				<ProjectForm
					formLabel={initFormValues._id ? 'Update Project' : 'New Project'}
					initFormValues={initFormValues}
				/>
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
				onRowClick={handleRowClick}
			/>
			{/* {rowMessage && <Alert severity="info">{rowMessage}</Alert>} */}
			<Dialog
				fullScreen
				open={projDetailDialog}
				onClose={handleClose}
				TransitionComponent={Transition}
			>
				<AppBar sx={{ position: 'relative' }}>
					<Toolbar>
						<IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
							<CloseIcon />
						</IconButton>
						<Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
							{rowMessage}
						</Typography>
						<Button autoFocus color="inherit" onClick={handleClose}>
							save
						</Button>
					</Toolbar>
				</AppBar>
				<List>
					<ListItem button>
						<ListItemText primary="Phone ringtone" secondary="Titania" />
					</ListItem>
					<Divider />
					<ListItem button>
						<ListItemText primary="Default notification ringtone" secondary="Tethys" />
					</ListItem>
				</List>
			</Dialog>
		</Box>
	)
}

export default ProjectsGridWidget
