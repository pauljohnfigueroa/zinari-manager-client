import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme } from '@emotion/react'

import { fetchTasks } from 'state/tasksSlice.js'

import { Box, IconButton } from '@mui/material'
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import LinearProgress from '@mui/material/LinearProgress'

import { tokens } from '../theme.js'

const TasksGridWidget = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const dispatch = useDispatch()
  const tasks = useSelector(state => state.tasks.tasks)
  const token = useSelector(state => state.auth.token)

  const getTasks = async () => {
    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/tasks`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    })

    const data = await response.json()

    dispatch(fetchTasks({ tasks: data }))
  }

  useEffect(() => {
    getTasks()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const showEditForm = () => {
    console.log('show edit form')
  }

  const columns = [
    {
      field: '_id',
      headerName: 'ID'
    },
    {
      field: 'owner',
      headerName: 'Owner',
      flex: 1
    },
    {
      field: 'title',
      headerName: 'Title',
      flex: 1
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1
    },
    {
      field: 'category',
      headerName: 'Category',
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
      <DataGrid
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
        experimentalFeatures={{ newEditingApi: false }}
        rowsPerPageOptions={[5, 10, 20]}
        rows={tasks ? tasks : []}
        columns={columns}
        checkboxSelection
        disableSelectionOnClick
      />
    </Box>
  )
}

export default TasksGridWidget
