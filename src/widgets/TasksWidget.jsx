import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { setTasks } from 'state/redux'

import { Box } from '@mui/material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import LinearProgress from '@mui/material/LinearProgress'
const TasksWidget = () => {
  const dispatch = useDispatch()
  const tasks = useSelector(state => state.tasks)
  const token = useSelector(state => state.token)
  const [gridData, setGridData] = useState()

  const getTasks = async () => {
    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/tasks`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    })

    const data = await response.json()
    console.log(data)
    dispatch(setTasks({ tasks: data }))
    setGridData(data)
  }

  useEffect(() => {
    getTasks()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
    }
  ]

  return (
    <Box height="60vh">
      <DataGrid
        getRowId={row => row._id}
        sx={{
          boxShadow: 4
        }}
        components={{
          Toolbar: GridToolbar,
          LoadingOverlay: LinearProgress
        }}
        experimentalFeatures={{ newEditingApi: false }}
        rowsPerPageOptions={[5, 10, 20]}
        rows={gridData ? gridData : []}
        columns={columns}
        checkboxSelection
        disableSelectionOnClick
      />
    </Box>
  )
}

export default TasksWidget
