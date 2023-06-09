/* The ProjectForm.jsx component is used on both create and update Project.*/
import { useState } from 'react'
import { Formik, Form, Field } from 'formik'

/* Redux */
import { useSelector, useDispatch } from 'react-redux'
import { createProject, updateProject, addProjectFormState } from '../../state/projectsSlice'

import dayjs from 'dayjs'

// MUI
import {
	Box,
	useMediaQuery,
	InputLabel,
	MenuItem,
	Select,
	FormControl,
	Chip,
	OutlinedInput
} from '@mui/material'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import DialogActions from '@mui/material/DialogActions'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

import FormikDatePicker from 'components/FormikDatePicker'

import { useTheme } from '@emotion/react'
import useFetchTeams from 'hooks/useFetchTeams'

// select element
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

const ProjectForm = ({ initFormValues }) => {
	const isNonMobile = useMediaQuery('(min-width: 600px)')
	const theme = useTheme()
	const [error, setError] = useState()

	const token = useSelector(state => state.auth.token)
	const [teams] = useFetchTeams()
	const dispatch = useDispatch()

	// When we do record update, the date format will be in the saved ISO format similar to 2018-04-04T16:00:00.000Z
	// To enable the Update form to load the current record's date,
	// We first need to convert the ISO format date to dayjs format.
	let initialFormValues = { ...initFormValues, dueDate: dayjs(initFormValues.dueDate) }
	let projTeams

	// if we are updating a project
	if (initFormValues.projTeams) {
		projTeams = initFormValues?.projTeams.map(projTeam => `${projTeam._id}|${projTeam.name}`)
		// update
		initialFormValues = { ...initialFormValues, projTeams }
	}

	/* Chip */
	/* 
    Convert the user object and get only the user's name 
    Make sure that you format this correctly like the array below.
    const memberNames = [
       'Oliver Hansen',
       'Van Henry',
    ]
  */
	const teamNames = teams.map(team => `${team._id}|${team.name}`)

	function getStyles(name, teamName, theme) {
		return {
			fontWeight:
				teamName.indexOf(name) === -1
					? theme.typography.fontWeightRegular
					: theme.typography.fontWeightMedium
		}
	}

	const handleClose = (event, reason) => {
		if (reason !== 'backdropClick') {
			dispatch(addProjectFormState({ open: false }))
		}
	}

	const handleCreateProject = async values => {
		//console.log('values', values)
		await fetch(`${process.env.REACT_APP_SERVER_URL}/projects`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(values)
		})
			.then(async response => {
				const newProject = await response.json()
				//console.log('newProject', newProject)
				dispatch(createProject({ project: newProject[0] }))
				dispatch(addProjectFormState({ open: false }))
			})
			.catch(err => {
				setError(err)
				console.log(err)
			})
	}

	const handleUpdateProject = async values => {
		console.log('values', values)
		const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/projects/${values._id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(values)
		})

		const updatedProject = await response.json()

		console.log('updatedProject', updatedProject)

		dispatch(updateProject({ project: updatedProject[0] }))
		dispatch(addProjectFormState({ open: false }))
	}

	return (
		<div>
			{error && <div>{error}</div>}
			<Formik
				onSubmit={
					initialFormValues._id
						? (values, actions) => {
								handleUpdateProject(values)
						  }
						: (values, actions) => {
								handleCreateProject(values)
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
							<Field type="hidden" id="manager" name="manager" value={values.manager} />

							<TextField
								fullWidth
								autoFocus
								autoComplete="off"
								margin="dense"
								name="title"
								id="title"
								value={values.title}
								label="Name"
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
							{/* Due Date */}
							<FormControl sx={{ gridColumn: 'span 2' }}>
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<FormikDatePicker
										name="dueDate"
										id="dueDate"
										renderInput={params => <TextField {...params} label="Due Date" />}
									/>
								</LocalizationProvider>
							</FormControl>
							{/* Select Teams */}
							<FormControl sx={{ gridColumn: 'span 4' }}>
								<InputLabel id="teams-label">Select Teams</InputLabel>
								<Select
									labelId="teams-label"
									id={initialFormValues._id ? 'projTeams' : 'teams'}
									name={initialFormValues._id ? 'projTeams' : 'teams'}
									multiple
									value={initialFormValues._id ? values.projTeams : values.teams}
									onChange={handleChange}
									input={<OutlinedInput id="teams-input" label="Select Teams" />}
									renderValue={selected => (
										<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
											{selected.map(
												value =>
													value && <Chip key={value.split('|')[0]} label={value.split('|')[1]} />
											)}
										</Box>
									)}
									MenuProps={MenuProps}
								>
									{teamNames.map(team => (
										<MenuItem
											key={team.split('|')[0]}
											value={team}
											style={getStyles(
												team[0],
												initialFormValues._id ? values.projTeams : values.teams,
												theme
											)}
										>
											{team.split('|')[1]}
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
		</div>
	)
}

export default ProjectForm
