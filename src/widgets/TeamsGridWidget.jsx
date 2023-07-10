/* 
The TeamsGridWidget.jsx component is a datagrid where all Teams are listed.

Components

*/
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme } from '@emotion/react'

import { fetchTeams, addTeamFormState } from 'state/teamsSlice.js'
import TeamForm from 'components/forms/TeamForm.jsx'

import { Box, IconButton, Avatar, AvatarGroup } from '@mui/material'
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

	/* Fetch teams */
	useEffect(() => {
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
			// console.log('useEffect fetchTeams teams', teams)
			dispatch(fetchTeams({ teams }))
		}
		getTeams()
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	/* Update Team form */
	const showEditForm = row => {
		dispatch(addTeamFormState({ open: true }))
		setInitFormValues(row)
	}

	/* Grid columns */
	const columns = [
		{
			field: '_id',
			headerName: 'ID'
		},

		{
			field: 'name',
			headerName: 'Name',
			flex: 1
		},
		{
			field: 'description',
			headerName: 'Description',
			flex: 2
		},
		{
			field: 'teamLeader',
			headerName: 'Leader',
			renderCell: rowData => (
				/* Show names of Team Members as a <Chip /> */
				<Avatar
					title={`${rowData.row.teamLeader[0].firstName} ${rowData.row.teamLeader[0].lastName}`}
					alt={`${rowData.row.teamLeader[0].firstName} ${rowData.row.teamLeader[0].lastName}`}
					src={`/assets/images/${rowData.row.teamLeader[0].photo}`}
					sx={{
						width: 24,
						height: 24,
						'&:hover': {
							cursor: 'pointer'
						}
					}}
					onClick={() =>
						alert(`${rowData.row.teamLeader[0].firstName} ${rowData.row.teamLeader[0].lastName}`)
					}
				/>
			)
		},
		{
			field: 'members',
			headerName: 'Members',
			flex: 1,
			renderCell: rowData => (
				/* Show names of team members as a <Chip /> */
				<AvatarGroup
					max={2}
					variant="circular"
					sx={{
						'& .MuiAvatarGroup-avatar': {
							width: 24,
							height: 24,
							fontSize: '.8rem',
							border: 'none'
						}
					}}
				>
					{rowData.row.teamMembers.map(member => (
						<Avatar
							key={member._id}
							title={`${member.firstName} ${member.lastName}`}
							alt={`${member.firstName} ${member.lastName}`}
							src={`/assets/images/${member.photo}`}
							sx={{
								width: 24,
								height: 24,
								'&:hover': {
									border: '1px solid white',
									cursor: 'pointer'
								}
							}}
							onClick={() => alert(`${member.firstName} ${member.lastName}`)}
						/>
					))}
				</AvatarGroup>
			)
		},
		{
			field: 'action',
			headerName: 'Action',
			flex: 1,
			renderCell: rowData => {
				return (
					<Box>
						<IconButton title="Edit" onClick={() => showEditForm(rowData.row)}>
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
