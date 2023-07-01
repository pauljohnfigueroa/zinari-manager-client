/* 
The TeamsGridWidget.jsx component is a datagrid where all Teams are listed.

Components

*/
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme } from '@emotion/react'

import { fetchTeams, addTeamFormState } from 'state/teamsSlice.js'
import TeamForm from 'pages/teams/TeamForm.jsx'

import { Box, IconButton, Chip, Avatar, AvatarGroup, Stack } from '@mui/material'
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import LinearProgress from '@mui/material/LinearProgress'

import { setCheckedIds } from 'state/datagridSlice.js'
import { tokens } from '../theme.js'

const TeamsGridWidget = ({ initFormValues, setInitFormValues }) => {
	const theme = useTheme()
	const colors = tokens(theme.palette.mode)

	const dispatch = useDispatch()
	const teams = useSelector(state => state.team.teams)
	const open = useSelector(state => state.team.open)
	const token = useSelector(state => state.auth.token)
	const user = useSelector(state => state.auth.user)

	/* FETCH Teams */
	useEffect(() => {
		// Backend
		const getTeams = async () => {
			const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/users/teams`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ userId: user._id })
			})
			const teams = await response.json()

			// Frontend
			/* Dispatch */
			dispatch(fetchTeams({ teams }))
		}
		getTeams()
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	/* UPDATE Team FORM */
	const showEditForm = row => {
		dispatch(addTeamFormState({ open: true }))
		setInitFormValues(row)
	}

	/* GRID COLUMNS */
	const columns = [
		{
			field: '_id',
			headerName: 'ID'
		},

		{
			field: 'name',
			headerName: 'Name'
		},
		{
			field: 'description',
			headerName: 'Description',
			flex: 2
		},
		{
			field: 'leader',
			headerName: 'Leader'
		},
		{
			field: 'members',
			headerName: 'Members',
			flex: 1,
			renderCell: rowdata => (
				/* Show names of Team Members as a <Chip /> */
				<AvatarGroup
					max={2}
					variant="circular"
					sx={{
						'& .MuiAvatarGroup-avatar': {
							width: 24,
							height: 24,
							fontSize: 12,
							border: 'none'
						}
					}}
				>
					{rowdata.row.teamMembers.map(member => (
						<Avatar
							title={`${member.firstName} ${member.firstName}`}
							alt={`${member.firstName} ${member.firstName}`}
							src={`/assets/images/${member.photo}`}
							sx={{ width: 24, height: 24 }}
							onClick={() => alert(`${member.firstName} ${member.firstName}`)}
						/>
					))}
				</AvatarGroup>
			)
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
			{open && (
				<TeamForm
					formLabel={initFormValues._id ? 'Update Team' : 'New Team'}
					initFormValues={initFormValues}
				/>
			)}

			{/* DATAGRID */}
			<DataGrid
				initialState={{
					columns: {
						columnVisibilityModel: {
							// Hide columns listed here, the other columns will remain visible
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
				getRowHeight={() => 'auto'}
				slots={{
					toolbar: GridToolbar,
					loadingOverlay: LinearProgress
				}}
				rows={teams ? teams : []}
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

export default TeamsGridWidget
