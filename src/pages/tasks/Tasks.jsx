/* 
The Tasks.jsx component serves as the dashboard page for Tasks.

Components
  - TasksGridWidget.jsx
  - TaskForm.jsx
*/
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { Box, Stack, Typography } from '@mui/material'
import Button from '@mui/material/Button'

import { addTaskFormState, deleteTasks } from '../../state/tasksSlice'

import dayjs from 'dayjs'

import TasksGridWidget from 'widgets/TasksGridWidget.jsx'
import AvgCompletionRateWidget from 'widgets/AvgCompletionRateWidget'
import AvgOverdueRateWidget from 'widgets/AvgOverdueRateWidget'
import TasksPieChartWidget from 'widgets/TasksPieChartWidget'
import TaskForm from './TaskForm'

import { useTheme } from '@emotion/react'

import { tokens } from '../../theme.js'
import FlexBetween from 'components/FlexBetween.jsx'

const Tasks = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  // const [due, setDue] = useState()

  const dispatch = useDispatch()
  const user = useSelector(state => state.auth.user)
  const token = useSelector(state => state.auth.token)
  const formState = useSelector(state => state.task.formState)
  const checkedIds = useSelector(state => state.datagrid.checkedIds)

  // Create/Update Form
  const initialValues = {
    _id: null,
    email: user.email,
    title: '',
    description: '',
    priority: '',
    category: '',
    dueDate: dayjs().add(0, 'day')
  }
  const [initFormValues, setInitFormValues] = useState(initialValues)

  /* OPEN FORM */
  const openAddTaskForm = () => {
    setInitFormValues(initialValues)
    dispatch(addTaskFormState({ formState: true }))
  }

  /* DELETE TASKS */
  const handleDeleteTasks = async () => {
    // Backend
    console.log('checkedIds', checkedIds)
    checkedIds.map(async id => {
      await fetch(`${process.env.REACT_APP_SERVER_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    })
    // Frontend
    /* DISPATCH */
    dispatch(deleteTasks({ checkedIds }))
  }

  return (
    <Box sx={{ p: '1rem 5%' }}>
      {formState && (
        <TaskForm
          formLabel={initFormValues._id ? 'Update Task' : 'New Task'}
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
        Tasks
      </Typography>
      <Box border="1px solid gray">
        <FlexBetween justifyContent="start">
          <FlexBetween
            sx={{
              flexDirection: 'column',
              border: '1px solid gray',
              width: '50%'
            }}
          >
            <Box height="300px" border="1px solid gray">
              <TasksPieChartWidget />
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
      </Box>
      <Box>
        <Box m="10px 0 0 0">
          <Stack spacing={2} direction="row">
            <Button onClick={openAddTaskForm} variant="contained">
              Add Task
            </Button>
            <Button
              disabled={checkedIds.length ? false : true}
              onClick={handleDeleteTasks}
              variant="outlined"
            >
              Delete Selected
            </Button>
          </Stack>
        </Box>
        <Box m="10px 0 0 0">
          <TasksGridWidget initFormValues={initFormValues} setInitFormValues={setInitFormValues} />
        </Box>
      </Box>
    </Box>
  )
}

export default Tasks
