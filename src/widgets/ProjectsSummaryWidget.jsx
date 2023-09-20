import React from 'react'
import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'

import { useTheme } from '@emotion/react'
// import { tokens } from 'theme'

const ProjectsSummaryWidget = ({ title }) => {
	// const theme = useTheme()
	// const colors = tokens(theme.palette.mode)
	return (
		<>
			<Typography
				variant="h3"
				sx={{ paddingBottom: 1 }}
			>
				{title}
			</Typography>

			<Box>
				<Typography
					variant="h5"
					sx={{ paddingBottom: 1 }}
				>
					% of Project Completed: 52.33%
				</Typography>
				<Typography
					variant="h5"
					sx={{ paddingBottom: 1 }}
				>
					Total completed tasks: 56
				</Typography>
				<Typography
					variant="h5"
					sx={{ paddingBottom: 1 }}
				>
					Total number of tasks: 107
				</Typography>

				<Typography
					variant="h3"
					sx={{ paddingBottom: 1 }}
				>
					Teams
				</Typography>
				<Typography
					variant="h5"
					sx={{ paddingBottom: 1 }}
				>
					Compliance Team: 52.33%
				</Typography>
				<Typography
					variant="h5"
					sx={{ paddingBottom: 1 }}
				>
					Collection Team: 67.89%
				</Typography>
				<Typography
					variant="h5"
					sx={{ paddingBottom: 1 }}
				>
					Marketing Team: 87.34%
				</Typography>
				<Typography
					variant="h5"
					sx={{ paddingBottom: 1 }}
				>
					Foreclosure Team: 32.34%
				</Typography>
			</Box>
		</>
	)
}

export default ProjectsSummaryWidget
