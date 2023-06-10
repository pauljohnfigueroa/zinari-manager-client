/* 
The Roles.jsx component serves as the dashboard page for Roles.

Components
  - RolesGridWidget.jsx
  - RoleForm.jsx
*/
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { Box, Stack, Typography } from '@mui/material'
import Button from '@mui/material/Button'

import { addRoleFormState, deleteRoles } from '../../../state/rolesSlice'

// import dayjs from 'dayjs'
// import FlexBetween from '../../../components/FlexBetween.jsx'

import RolesGridWidget from '../../../widgets/RolesGridWidget.jsx'
import RoleForm from './RoleForm'

import { useTheme } from '@emotion/react'

import { tokens } from '../../../theme.js'

const Roles = () => {
	const theme = useTheme()
	const colors = tokens(theme.palette.mode)

	// const [due, setDue] = useState()

	const dispatch = useDispatch()
	const user = useSelector(state => state.auth.user)
	const token = useSelector(state => state.auth.token)
	const formState = useSelector(state => state.role.formState)
	const checkedIds = useSelector(state => state.datagrid.checkedIds)

	// Create/Update Form
	const initialValues = {
		_id: null,
		createdBy: user.email,
		name: '',
		description: '',
		permissions: []
	}
	const [initFormValues, setInitFormValues] = useState(initialValues)

	/* OPEN FORM */
	const openAddRoleForm = () => {
		setInitFormValues(initialValues)
		dispatch(addRoleFormState({ formState: true }))
	}

	/* DELETE TASKS */
	const handleDeleteRoles = async () => {
		// Backend
		console.log('checkedIds', checkedIds)

		checkedIds.map(async id => {
			await fetch(`${process.env.REACT_APP_SERVER_URL}/roles/${id}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`
				}
			})
		})
		// Frontend
		/* DISPATCH */
		dispatch(deleteRoles({ checkedIds }))
	}

	return (
		<Box sx={{ p: '1rem 5%' }}>
			{formState && (
				<RoleForm
					formLabel={initFormValues._id ? 'Update Role' : 'New Role'}
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
				Roles
			</Typography>
			{/* <Box border="1px solid gray">
        <FlexBetween justifyContent="start">
          <FlexBetween
            sx={{
              flexDirection: 'column',
              border: '1px solid gray',
              width: '50%'
            }}
          >
            <Box height="300px" border="1px solid gray">
              <RolesPieChartWidget />
            </Box>
          </FlexBetween>
          <FlexBetween
            sx={{
              flexDirection: 'column',
              border: '1px solid gray',
              width: '50%'
            }}
          >
            <Box height="150px" border="1px solid gray">
              <AvgCompletionRateWidget />
            </Box>
            <Box height="150px" border="1px solid gray">
              <AvgOverdueRateWidget />
            </Box>
          </FlexBetween>
        </FlexBetween>
      </Box> */}
			<Box>
				<Box m="10px 0 0 0">
					<Stack spacing={2} direction="row">
						<Button onClick={openAddRoleForm} variant="contained">
							Add Role
						</Button>
						<Button
							disabled={checkedIds.length ? false : true}
							onClick={handleDeleteRoles}
							variant="outlined"
						>
							Delete Selected
						</Button>
					</Stack>
				</Box>
				<Box m="10px 0 0 0">
					<RolesGridWidget initFormValues={initFormValues} setInitFormValues={setInitFormValues} />
				</Box>
			</Box>
		</Box>
	)
}

export default Roles
