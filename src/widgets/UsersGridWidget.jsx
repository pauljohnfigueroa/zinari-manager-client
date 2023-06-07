/* 
The UsersGridWidget.jsx component is a datagrid where all users are listed.

Components

*/
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme } from '@emotion/react'

import { fetchUsers, addUserFormState } from 'state/usersSlice.js'
import UserForm from 'pages/admin/users/UserForm.jsx'
import { Box, IconButton } from '@mui/material'
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import LinearProgress from '@mui/material/LinearProgress'

import { setCheckedIds } from 'state/datagridSlice.js'

import { tokens } from '../theme.js'

const UsersGridWidget = ({ initFormValues, setInitFormValues }) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const dispatch = useDispatch()
  const users = useSelector(state => state.user.users)
  const formState = useSelector(state => state.user.formState)
  const token = useSelector(state => state.auth.token)

  /* FETCH TASKS */
  useEffect(() => {
    // Backend
    const getUsers = async () => {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/users`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      })
      const users = await response.json()

      // Frontend
      /* Dispatch */
      dispatch(fetchUsers({ users }))
    }
    getUsers()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /* UPDATE TASK FORM */
  const showEditForm = row => {
    dispatch(addUserFormState({ formState: true }))
    setInitFormValues(row)
  }

  /* GRID COLUMNS */
  const columns = [
    {
      field: '_id',
      headerName: 'ID'
    },
    {
      field: 'firstName',
      headerName: 'First Name',
      flex: 1
    },
    {
      field: 'lastName',
      headerName: 'Surname',
      flex: 1
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1
    },
    {
      field: 'phone',
      headerName: 'Phone',
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
      {formState && (
        <UserForm
          formLabel={initFormValues._id ? 'Update User' : 'New User'}
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
        components={{
          Toolbar: GridToolbar,
          LoadingOverlay: LinearProgress
        }}
        rows={users ? users : []}
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

export default UsersGridWidget
