/* 
The Teams.jsx component serves as the dashboard page for Teams.

Components
  - TeamsGridWidget.jsx
  - TeamForm.jsx
*/
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { Box, Stack, Typography } from '@mui/material'
import Button from '@mui/material/Button'

import { addTeamFormState, deleteTeams } from '../../state/teamsSlice'

import TeamsGridWidget from 'widgets/TeamsGridWidget.jsx'
import TeamForm from './TeamForm'

import { useTheme } from '@emotion/react'

import { tokens } from '../../theme.js'
// import FlexBetween from 'components/FlexBetween.jsx'

const Teams = () => {
	const theme = useTheme()
	const colors = tokens(theme.palette.mode)

	const dispatch = useDispatch()
	const user = useSelector(state => state.auth.user)
	const token = useSelector(state => state.auth.token)
	const open = useSelector(state => state.team.open)
	const checkedIds = useSelector(state => state.datagrid.checkedIds)

	// Create/Update Form
	const initialValues = {
		_id: null,
		name: '',
		description: '',
		leader: user.email,
		members: []
	}
	const [initFormValues, setInitFormValues] = useState(initialValues)

	/* OPEN FORM */
	const openAddTeamForm = () => {
		setInitFormValues(initialValues)
		dispatch(addTeamFormState({ open: true }))
	}

	/* DELETE Teams */
	const handleDeleteTeams = async () => {
		// Backend
		console.log('checkedIds', checkedIds)

		checkedIds.map(async id => {
			await fetch(`${process.env.REACT_APP_SERVER_URL}/teams/${id}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`
				}
			})
		})
		// Frontend
		/* DISPATCH */
		dispatch(deleteTeams({ checkedIds }))
	}

	return (
		<Box sx={{ p: '1rem 5%' }}>
			{open && (
				<TeamForm
					formLabel={initFormValues._id ? 'Update Team' : 'New Team'}
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
				Teams
			</Typography>
			<Box>
				<Box m="10px 0 0 0">
					<Stack spacing={2} direction="row">
						<Button onClick={openAddTeamForm} variant="contained">
							Add Team
						</Button>
						<Button
							disabled={checkedIds.length ? false : true}
							onClick={handleDeleteTeams}
							variant="outlined"
						>
							Delete Selected
						</Button>
					</Stack>
				</Box>
				<Box m="10px 0 0 0">
					<TeamsGridWidget initFormValues={initFormValues} setInitFormValues={setInitFormValues} />
				</Box>
			</Box>
		</Box>
	)
}

export default Teams
