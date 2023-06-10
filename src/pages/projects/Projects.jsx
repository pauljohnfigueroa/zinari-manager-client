/* 
The Prjects.jsx component serves as the dashboard page for Projects.

Components
  - ProjectsGridWidget.jsx
  - ProjectForm.jsx
*/
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { Box, Stack, Typography } from '@mui/material'
import Button from '@mui/material/Button'

import { addProjectFormState, deleteProjects } from '../../state/projectsSlice'

import dayjs from 'dayjs'

import ProjectsGridWidget from 'widgets/ProjectsGridWidget.jsx'
import ProjectForm from './ProjectForm'

import { useTheme } from '@emotion/react'

import { tokens } from '../../theme.js'
// import FlexBetween from 'components/FlexBetween.jsx'

const Projects = () => {
	const theme = useTheme()
	const colors = tokens(theme.palette.mode)

	const dispatch = useDispatch()
	const user = useSelector(state => state.auth.user)
	const token = useSelector(state => state.auth.token)
	const formState = useSelector(state => state.task.formState)
	const checkedIds = useSelector(state => state.datagrid.checkedIds)

	// Create/Update Form
	const initialValues = {
		_id: null,
		email: user.email,
		name: '',
		description: '',
		teams: [],
		tasks: [],
		dueDate: dayjs().add(0, 'day').format('L')
	}
	const [initFormValues, setInitFormValues] = useState(initialValues)

	/* OPEN FORM */
	const openAddProjectForm = () => {
		setInitFormValues(initialValues)
		dispatch(addProjectFormState({ formState: true }))
	}

	/* DELETE Projects */
	const handleDeleteProjects = async () => {
		// Backend
		console.log('checkedIds', checkedIds)

		checkedIds.map(async id => {
			await fetch(`${process.env.REACT_APP_SERVER_URL}/projects/${id}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`
				}
			})
		})
		// Frontend
		/* DISPATCH */
		dispatch(deleteProjects({ checkedIds }))
	}

	return (
		<Box sx={{ p: '1rem 5%' }}>
			{formState && (
				<ProjectForm
					formLabel={initFormValues._id ? 'Update Project' : 'New Project'}
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
				Projects
			</Typography>
			<Box>
				<Box m="10px 0 0 0">
					<Stack spacing={2} direction="row">
						<Button onClick={openAddProjectForm} variant="contained">
							Add Project
						</Button>
						<Button
							disabled={checkedIds.length ? false : true}
							onClick={handleDeleteProjects}
							variant="outlined"
						>
							Delete Selected
						</Button>
					</Stack>
				</Box>
				<Box m="10px 0 0 0">
					<ProjectsGridWidget
						initFormValues={initFormValues}
						setInitFormValues={setInitFormValues}
					/>
				</Box>
			</Box>
		</Box>
	)
}

export default Projects
