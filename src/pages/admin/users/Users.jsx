/* 
The Users.jsx component serves as the dashboard page for Users.

Components
  - UsersGridWidget.jsx
  - UserForm.jsx
*/
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { Box, Stack, Typography } from '@mui/material'
import Button from '@mui/material/Button'

import { addUserFormState, deleteUsers } from '../../../state/usersSlice'

// import dayjs from 'dayjs'
// import FlexBetween from '../../../components/FlexBetween.jsx'

import UsersGridWidget from '../../../widgets/UsersGridWidget.jsx'

import UserForm from './UserForm'

import { useTheme } from '@emotion/react'

import { tokens } from '../../../theme.js'

const Users = ({ authPermissions }) => {
	const theme = useTheme()
	const colors = tokens(theme.palette.mode)

	// const [due, setDue] = useState()

	const dispatch = useDispatch()
	const user = useSelector(state => state.auth.user)
	const token = useSelector(state => state.auth.token)
	const formState = useSelector(state => state.user.formState)
	const checkedIds = useSelector(state => state.datagrid.checkedIds)

	// Create/Update Form
	const initialValues = {
		_id: undefined,
		createdBy: user.email,
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		password: '',
		role: ''
	}
	const [initFormValues, setInitFormValues] = useState(initialValues)

	/* Open the form */
	const openAddUserForm = () => {
		setInitFormValues(initialValues)
		dispatch(addUserFormState({ formState: true }))
	}

	/* Delete Task/s */
	const handleDeleteUsers = async () => {
		// Backend
		console.log('checkedIds', checkedIds)

		checkedIds.map(async id => {
			await fetch(`${process.env.REACT_APP_SERVER_URL}/users/${id}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`
				}
			})
		})

		dispatch(deleteUsers({ checkedIds }))
	}

	return authPermissions.includes('view_users_dashboard') ? (
		<Box sx={{ p: '1rem 5%' }}>
			{formState && (
				<UserForm
					formLabel={initFormValues._id ? 'Update User' : 'New User'}
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
				Users
			</Typography>

			<Box>
				<Box m="10px 0 0 0">
					<Stack spacing={2} direction="row">
						{authPermissions.includes('create_user') ? (
							<Button onClick={openAddUserForm} variant="contained">
								Add User
							</Button>
						) : (
							<Button onClick={openAddUserForm} disabled variant="contained">
								Add User
							</Button>
						)}

						{authPermissions.includes('delete_users') ? (
							<Button
								disabled={checkedIds.length ? false : true}
								onClick={handleDeleteUsers}
								variant="outlined"
							>
								Delete Selected
							</Button>
						) : (
							<Button disabled onClick={handleDeleteUsers} variant="outlined">
								Delete Selected
							</Button>
						)}
					</Stack>
				</Box>
				<Box m="10px 0 0 0">
					<UsersGridWidget initFormValues={initFormValues} setInitFormValues={setInitFormValues} />
				</Box>
			</Box>
		</Box>
	) : (
		<Box>
			<Typography>You have no permission to view this page.</Typography>
		</Box>
	)
}

export default Users
