import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { Box, Stack, Typography } from '@mui/material'
import Button from '@mui/material/Button'

import { useTheme } from '@emotion/react'

import { addTaskFormState, deleteTasks } from '../../state/tasksSlice'

import dayjs from 'dayjs'

import TasksGridWidget from 'widgets/TasksGridWidget.jsx'
import AvgCompletionRateWidget from 'widgets/AvgCompletionRateWidget'
import AvgOverdueRateWidget from 'widgets/AvgOverdueRateWidget'
import TasksPieChartWidget from 'widgets/TasksPieChartWidget'
import TaskForm from './TaskForm'

import { tokens } from '../../theme.js'
import FlexBetween from 'components/FlexBetween.jsx'

const Tasks = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const [due, setDue] = useState(dayjs().add(0, 'day'))

  const dispatch = useDispatch()
  const user = useSelector(state => state.auth.user)
  const token = useSelector(state => state.auth.token)
  const formState = useSelector(state => state.task.formState)
  const checkedIds = useSelector(state => state.datagrid.checkedIds)

  const initialValues = {
    _id: null,
    email: user.email,
    title: '',
    description: '',
    priority: '',
    category: '',
    dueDate: due
  }
  const [initFormValues, setInitFormValues] = useState(initialValues)

  /* OPEN FORM */
  const openAddTaskForm = () => {
    setInitFormValues(initialValues)
    dispatch(addTaskFormState({ formState: true }))
  }

  /* DELETE TASKS */
  const handleDeleteTasks = async () => {
    console.log('checkedIds', checkedIds)
    checkedIds.map(async id => {
      await fetch(`${process.env.REACT_APP_SERVER_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    })

    /* Dispatch */
    dispatch(deleteTasks({ checkedIds }))
  }

  return (
    <Box sx={{ p: '1rem 5%' }}>
      {formState && (
        <TaskForm
          formLabel={initFormValues._id ? 'Update Task' : 'New Task'}
          due={due}
          setDue={setDue}
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
          <TasksGridWidget
            initFormValues={initFormValues}
            setInitFormValues={setInitFormValues}
            due={due}
            setDue={setDue}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default Tasks
