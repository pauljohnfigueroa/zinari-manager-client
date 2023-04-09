import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { Box, Stack, Typography } from '@mui/material'
import Button from '@mui/material/Button'

import { useTheme } from '@emotion/react'

import { addTaskFormState } from '../../state/task.redux'

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

  const formState = useSelector(state => state.formState)
  const dispatch = useDispatch()

  const openAddTaskForm = () => {
    dispatch(addTaskFormState({ formState: true }))
  }

  return (
    <Box sx={{ p: '1rem 5%' }}>
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
      {formState && <TaskForm formLabel="Create a New Task" />}
      <Box>
        <Box m="10px 0 0 0">
          <Stack spacing={2} direction="row">
            <Button onClick={openAddTaskForm} variant="contained">
              Add Task
            </Button>
            <Button
              // disabled={checkedIds.length ? false : true}
              onClick={() => {
                console.log('Add User clicked')
              }}
              variant="outlined"
            >
              Delete Selected
            </Button>
          </Stack>
        </Box>
        <Box m="10px 0 0 0">
          <TasksGridWidget />
        </Box>
      </Box>
    </Box>
  )
}

export default Tasks
