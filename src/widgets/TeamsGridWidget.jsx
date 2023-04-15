/* 
The TeamsGridWidget.jsx component is a datagrid where all Teams are listed.

Components

*/
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme } from '@emotion/react'

import { fetchTeams, addTeamFormState } from 'state/teamsSlice.js'
import TeamForm from 'pages/teams/TeamForm.jsx'

import { Box, IconButton, Chip, Avatar, Stack } from '@mui/material'
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
  const formState = useSelector(state => state.team.formState)
  const token = useSelector(state => state.auth.token)
  const user = useSelector(state => state.auth.user)

  /* FETCH TeamS */
  useEffect(() => {
    // Backend
    const getTeams = async () => {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/users/teams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(user)
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
    dispatch(addTeamFormState({ formState: true }))
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
        <Stack direction="column" spacing={1} justifyContent="center" alignItems="center">
          {rowdata.row.members.map((item, index) => (
            <Chip
              key={index}
              size="small"
              avatar={<Avatar alt={item} src="/assets/paul.jpg" />}
              label={item}
              variant="outlined"
              color="success"
            />
          ))}
        </Stack>
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
      {formState && (
        <TeamForm
          formLabel={initFormValues._id ? 'Update Team' : 'New Team'}
          initFormValues={initFormValues}
        />
      )}

      {/* DATAGRID */}
      <DataGrid
        getRowId={row => row._id}
        sx={{
          backgroundColor: colors.grey[800],
          '& .MuiDataGrid-row:hover': {
            color: colors.grey[400],
            backgroundColor: colors.primary.main
          }
        }}
        getRowHeight={() => 'auto'}
        components={{
          Toolbar: GridToolbar,
          LoadingOverlay: LinearProgress
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
