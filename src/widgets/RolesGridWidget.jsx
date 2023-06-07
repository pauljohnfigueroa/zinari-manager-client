/* 
The RolesGridWidget.jsx component is a datagrid where all roles are listed.

Components

*/
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme } from '@emotion/react'

import { fetchRoles, addRoleFormState } from 'state/rolesSlice.js'
import RoleForm from 'pages/admin/roles/RoleForm.jsx'
import { Box, IconButton } from '@mui/material'
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import LinearProgress from '@mui/material/LinearProgress'

import { setCheckedIds } from 'state/datagridSlice.js'

import { tokens } from '../theme.js'

const RolesGridWidget = ({ initFormValues, setInitFormValues }) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const dispatch = useDispatch()
  const roles = useSelector(state => state.role.roles)
  const formState = useSelector(state => state.role.formState)
  const token = useSelector(state => state.auth.token)

  /* FETCH TASKS */
  useEffect(() => {
    // Backend
    const getRoles = async () => {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/roles`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      })
      const roles = await response.json()

      // Frontend
      /* Dispatch */
      dispatch(fetchRoles({ roles }))
    }
    getRoles()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /* UPDATE TASK FORM */
  const showEditForm = row => {
    dispatch(addRoleFormState({ formState: true }))
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
      headerName: 'Name',
      flex: 1
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1
    },
    {
      field: 'createdBy',
      headerName: 'Created by',
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
        <RoleForm
          formLabel={initFormValues._id ? 'Update Role' : 'New Role'}
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
        rows={roles ? roles : []}
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

export default RolesGridWidget
