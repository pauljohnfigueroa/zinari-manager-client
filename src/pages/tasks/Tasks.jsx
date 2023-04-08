import { Box, Typography } from '@mui/material'
import { useTheme } from '@emotion/react'
import TasksWidget from 'widgets/TasksWidget'
const Tasks = () => {
  const { palette } = useTheme()

  return (
    <Box sx={{ p: '1rem 5%' }}>
      <Typography
        sx={{
          color: palette.primary.main,
          fontSize: '2rem',
          fontWeight: '700',
          letterSpacing: '2px'
        }}
      >
        Tasks
      </Typography>
      <Box>
        <TasksWidget />
      </Box>
    </Box>
  )
}

export default Tasks
