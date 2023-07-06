import { useEffect, useState, forwardRef } from 'react'

import { Box } from '@mui/material'
import Grid from '@mui/material/Grid'

import Typography from '@mui/material/Typography'

/* Drawer */
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import ListItemText from '@mui/material/ListItemText'
import ListItem from '@mui/material/ListItem'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Slide from '@mui/material/Slide'

/* Accordion */
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="right" ref={ref} {...props} />
})

const ProjectsDrawer = () => {
	const [projDetailDialog, setProjDetailDialog] = useState(true)
	const [rowMessage, setRowMessage] = useState()

	const handleRowClick = params => {
		setProjDetailDialog(!projDetailDialog)
		setRowMessage(`Project Title: ${params.row.title}`)
	}

	const handleClose = () => {
		setProjDetailDialog(false)
	}

	return (
		<Box sx={{ flexGrow: 1 }}>
			<Dialog
				fullScreen
				open={projDetailDialog}
				onClose={handleClose}
				TransitionComponent={Transition}
			>
				<AppBar sx={{ position: 'relative' }}>
					<Toolbar>
						<IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
							<CloseIcon />
						</IconButton>
						<Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
							{rowMessage}
						</Typography>
					</Toolbar>
				</AppBar>
				{/* Team and Task Container */}

				{/* Teams */}
				<Grid container spacing={1}>
					<Grid item xs={12} md={4}>
						<Box
							sx={{
								backgroundColor: 'red',
								height: 200
							}}
						>
							Form
						</Box>
					</Grid>
					<Grid item xs={12} md={8}>
						<Box
							sx={{
								backgroundColor: 'green',
								height: 200
							}}
						>
							Summary
						</Box>
					</Grid>
					<Grid item xs={12} md={4}>
						<Box>
							<Accordion>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="team-1"
									id="team-1"
								>
									<Typography>Team 1</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Typography>
										Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada
										lacus ex, sit amet blandit leo lobortis eget.
									</Typography>
								</AccordionDetails>
							</Accordion>
							<Accordion>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="team-2"
									id="team-2"
								>
									<Typography>Team 2</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Typography>
										Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada
										lacus ex, sit amet blandit leo lobortis eget.
									</Typography>
								</AccordionDetails>
							</Accordion>
						</Box>
					</Grid>

					{/* Tasks */}
					<Grid item xs={12} md={8}>
						<Box>
							<Accordion>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel1a-content"
									id="panel1a-header"
								>
									<Typography>Task 1</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Typography>
										Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada
										lacus ex, sit amet blandit leo lobortis eget.
									</Typography>
								</AccordionDetails>
							</Accordion>
							<Accordion>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel2a-content"
									id="panel2a-header"
								>
									<Typography>Task 2</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Typography>
										Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada
										lacus ex, sit amet blandit leo lobortis eget.
									</Typography>
								</AccordionDetails>
							</Accordion>
						</Box>
					</Grid>
				</Grid>
			</Dialog>
		</Box>
	)
}

export default ProjectsDrawer
