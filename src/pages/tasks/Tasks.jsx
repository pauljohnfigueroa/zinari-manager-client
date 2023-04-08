import { Box, Typography } from '@mui/material'
import { useTheme } from '@emotion/react'

import TasksGridWidget from 'widgets/TasksGridWidget.jsx'
import AvgCompletionRateWidget from 'widgets/AvgCompletionRateWidget'
import AvgOverdueRateWidget from 'widgets/AvgOverdueRateWidget'
import TasksPieChartWidget from 'widgets/TasksPieChartWidget'

import { tokens } from '../../theme.js'
import FlexBetween from 'components/FlexBetween.jsx'

const Tasks = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

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
      <Box border="1px solid red">
        <FlexBetween justifyContent="start">
          <FlexBetween
            sx={{
              flexDirection: 'column',
              border: '1px solid yellow',
              width: '50%'
            }}
          >
            <Box height="300px" border="1px solid red">
              <TasksPieChartWidget />
            </Box>
          </FlexBetween>
          <FlexBetween
            sx={{
              flexDirection: 'column',
              border: '1px solid yellow',
              width: '50%'
            }}
          >
            <Box height="150px" border="1px solid red">
              <AvgCompletionRateWidget />
            </Box>
            <Box height="150px" border="1px solid red">
              <AvgOverdueRateWidget />
            </Box>
          </FlexBetween>
        </FlexBetween>
      </Box>
      <Box>
        <TasksGridWidget />
      </Box>
    </Box>
  )
}

export default Tasks
