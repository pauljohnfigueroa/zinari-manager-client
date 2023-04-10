import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme } from '@emotion/react'

import dayjs from 'dayjs'

import { fetchTasks, addTaskFormState } from 'state/tasksSlice.js'
import TaskForm from 'pages/tasks/TaskForm.jsx'
import { Box, IconButton } from '@mui/material'
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import LinearProgress from '@mui/material/LinearProgress'

import { tokens } from '../theme.js'

const TasksGridWidget = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const [due, setDue] = useState(dayjs().add(0, 'day'))

  const dispatch = useDispatch()
  const tasks = useSelector(state => state.tasks.tasks)
  const formState = useSelector(state => state.tasks.formState)
  const token = useSelector(state => state.auth.token)
  const user = useSelector(state => state.auth.user)

  const initialValues = {
    email: user.email,
    title: '',
    description: '',
    priority: '',
    category: '',
    dueDate: due
  }

  const [initFormValues, setInitFormValues] = useState(initialValues)

  useEffect(() => {
    const getTasks = async () => {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/tasks`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      })
      const tasks = await response.json()

      /* Dispatch */
      dispatch(fetchTasks({ tasks }))
    }
    getTasks()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const showEditForm = row => {
    dispatch(addTaskFormState({ formState: true }))
    setInitFormValues(row)
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
      {formState && (
        <TaskForm
          formLabel="Update Task"
          due={due}
          setDue={setDue}
          initFormValues={initFormValues}
        />
      )}
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
        rows={tasks ? tasks : []}
        columns={columns}
        checkboxSelection
        disableSelectionOnClick
      />
    </Box>
  )
}

export default TasksGridWidget
