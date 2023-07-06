import { useEffect, useState, forwardRef } from 'react'
import { useSelector } from 'react-redux'
import { Avatar, Box, Card, CardContent, CardHeader, TextField } from '@mui/material'
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

/* List */
import ListItemAvatar from '@mui/material/ListItemAvatar'

/* Tasks Comments */
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import ProjectForm from './ProjectForm'

/* Tasks Comments */
const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	padding: theme.spacing(1),
	color: theme.palette.text.secondary
}))

/* Accordion */
const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="right" ref={ref} {...props} />
})

const ProjectsDrawer = ({ projDetailDialog, setProjDetailDialog, rowMessage, initFormValues }) => {
	const user = useSelector(state => state.auth.user)
	// const [projDetailDialog, setProjDetailDialog] = useState(open)
	// const [rowMessage, setRowMessage] = useState()
	const [expanded, setExpanded] = useState(false)

	const handleChange = panel => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false)
	}

	const handleRowClick = params => {
		setProjDetailDialog(!projDetailDialog)
		// setRowMessage(`Project Title: ${params.row.title}`)
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
				<Box sx={{ padding: 4 }}>
					{/* Teams */}
					<Grid container spacing={1}>
						<Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
							<Box
								sx={{
									backgroundColor: '#aaaaaa',
									height: 100
								}}
							>
								Summary
							</Box>
						</Grid>
						<Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
							<Box>
								<ProjectForm initFormValues={initFormValues} />
							</Box>
						</Grid>

						<Grid item xs={12} md={12} order={{ xs: 3, md: 3 }}>
							<Box>
								<Typography>Teams</Typography>

								<Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
									<AccordionSummary
										expandIcon={<ExpandMoreIcon />}
										aria-controls="panel1bh-content"
										id="panel1bh-header"
									>
										<Typography sx={{ width: '50%', flexShrink: 0 }}>Compliance Team</Typography>
										<Typography sx={{ color: 'text.secondary' }}>50%</Typography>
									</AccordionSummary>
									<AccordionDetails>
										{/* Compliance Team Tasks*/}
										<Typography>Tasks</Typography>
										<Box>
											<Accordion>
												<AccordionSummary
													expandIcon={<ExpandMoreIcon />}
													aria-controls="panel1a-content"
													id="panel1a-header"
												>
													<Typography>
														Lorem ipsum dolor sit amet, consectetur adipiscing elit.
													</Typography>
												</AccordionSummary>
												<AccordionDetails>
													{/* List */}
													<List
														sx={{ width: '100%', paddingRight: 1, bgcolor: 'background.paper' }}
													>
														<ListItem alignItems="flex-start">
															{/* Put content here */}
															<Card
																sx={{
																	display: 'flex',
																	minHeight: 100,
																	width: '100%',
																	alignItems: 'center'
																}}
															>
																<CardHeader
																	avatar={
																		<Avatar
																			alt={`${user.firstName} ${user.lastName}`}
																			src={`/assets/images/gus-fring.png`}
																			sx={{ width: 48, height: 48 }}
																		/>
																	}
																/>
																<CardContent
																	sx={{
																		display: 'flex',
																		flexDirection: 'column',
																		width: '100%',
																		alignItems: 'start',
																		justifyContent: 'start'
																	}}
																>
																	<Typography
																		sx={{ color: 'gray', fontSize: 12, paddingBottom: 1 }}
																	>
																		July 05, 2023
																	</Typography>
																	<Typography
																		variant="body2"
																		color="text.secondary"
																		sx={{ textAlign: 'left' }}
																	>
																		Aenean turpis ante, porttitor sit amet dictum eget, mollis a
																		elit. In non leo in tellus aliquam molestie pellentesque eu
																		augue. Sed accumsan, ipsum viverra pretium maximus, purus diam
																		scelerisque est, quis suscipit sem est at neque. Sed a lorem
																		accumsan, mattis elit a, gravida nunc. Phasellus in lorem vel
																		orci bibendum placerat. Maecenas et urna ut ante volutpat
																		mattis. Proin volutpat ante lectus, placerat rutrum odio
																		ullamcorper blandit. Nulla congue dui orci, quis mollis arcu
																		eleifend non. Integer eget ex nec justo sagittis laoreet.
																	</Typography>
																</CardContent>
															</Card>
														</ListItem>
														<ListItem alignItems="flex-start">
															{/* Put content here */}
															<Card
																sx={{
																	display: 'flex',
																	minHeight: 100,
																	width: '100%',
																	alignItems: 'center'
																}}
															>
																<CardHeader
																	avatar={
																		<Avatar
																			alt={`${user.firstName} ${user.lastName}`}
																			src={`/assets/images/skyler-white.png`}
																			sx={{ width: 48, height: 48 }}
																		/>
																	}
																/>
																<CardContent
																	sx={{
																		display: 'flex',
																		flexDirection: 'column',
																		width: '100%',
																		alignItems: 'start',
																		justifyContent: 'start'
																	}}
																>
																	<Typography
																		sx={{ color: 'gray', fontSize: 12, paddingBottom: 1 }}
																	>
																		July 05, 2023
																	</Typography>
																	<Typography
																		variant="body2"
																		color="text.secondary"
																		sx={{ textAlign: 'left' }}
																	>
																		Aenean turpis ante, porttitor sit amet dictum eget, mollis a
																		elit. In non leo in tellus aliquam molestie pellentesque eu
																		augue.
																	</Typography>
																</CardContent>
															</Card>
														</ListItem>

														<ListItem alignItems="flex-start">
															{/* Put content here */}
															<Card
																sx={{
																	display: 'flex',
																	minHeight: 100,
																	width: '100%',
																	alignItems: 'center'
																}}
															>
																<CardHeader
																	avatar={
																		<Avatar
																			alt={`${user.firstName} ${user.lastName}`}
																			src={`/assets/images/walter-white.png`}
																			sx={{ width: 48, height: 48 }}
																		/>
																	}
																/>
																<CardContent
																	sx={{
																		display: 'flex',
																		flexDirection: 'column',
																		width: '100%',
																		alignItems: 'start',
																		justifyContent: 'start'
																	}}
																>
																	<Typography
																		sx={{ color: 'gray', fontSize: 12, paddingBottom: 1 }}
																	>
																		July 05, 2023
																	</Typography>
																	<Typography
																		variant="body2"
																		color="text.secondary"
																		sx={{ textAlign: 'left' }}
																	>
																		Aenean turpis ante, porttitor sit amet dictum eget, mollis a
																		elit.
																	</Typography>
																</CardContent>
															</Card>
														</ListItem>
														<ListItem>
															<Box sx={{ width: '100%' }}>
																<TextField
																	id="filled-multiline-flexible"
																	label="Comment"
																	placeholder="Type your comment here."
																	multiline
																	minRows={3}
																	maxRows={3}
																	variant="outlined"
																	sx={{ width: '100%', paddingBottom: 1 }}
																/>
																<Box sx={{ display: 'flex', justifyContent: 'end' }}>
																	<Button variant="filled">Post Comment</Button>
																</Box>
															</Box>
														</ListItem>
													</List>
												</AccordionDetails>
											</Accordion>
											<Accordion>
												<AccordionSummary
													expandIcon={<ExpandMoreIcon />}
													aria-controls="panel2a-content"
													id="panel2a-header"
												>
													<Typography>
														Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
													</Typography>
												</AccordionSummary>
												<AccordionDetails>
													<Typography>
														Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
														malesuada lacus ex, sit amet blandit leo lobortis eget.
													</Typography>
												</AccordionDetails>
											</Accordion>
										</Box>
									</AccordionDetails>
								</Accordion>
								<Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
									<AccordionSummary
										expandIcon={<ExpandMoreIcon />}
										aria-controls="panel2bh-content"
										id="panel2bh-header"
									>
										<Typography sx={{ width: '50%', flexShrink: 0 }}>Collection Team</Typography>
										<Typography sx={{ color: 'text.secondary' }}>33%</Typography>
									</AccordionSummary>
									<AccordionDetails>
										{/* Compliance Team Tasks*/}
										<Typography>Tasks</Typography>
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
														Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
														malesuada lacus ex, sit amet blandit leo lobortis eget.
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
														Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
														malesuada lacus ex, sit amet blandit leo lobortis eget.
													</Typography>
												</AccordionDetails>
											</Accordion>
										</Box>
									</AccordionDetails>
								</Accordion>
								<Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
									<AccordionSummary
										expandIcon={<ExpandMoreIcon />}
										aria-controls="panel3bh-content"
										id="panel3bh-header"
									>
										<Typography sx={{ width: '50%', flexShrink: 0 }}>Marketing Team</Typography>
										<Typography sx={{ color: 'text.secondary' }}>78%</Typography>
									</AccordionSummary>
									<AccordionDetails>
										{/* Compliance Team Tasks*/}
										<Typography>Tasks</Typography>
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
														Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
														malesuada lacus ex, sit amet blandit leo lobortis eget.
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
														Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
														malesuada lacus ex, sit amet blandit leo lobortis eget.
													</Typography>
												</AccordionDetails>
											</Accordion>
										</Box>
									</AccordionDetails>
								</Accordion>
								<Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
									<AccordionSummary
										expandIcon={<ExpandMoreIcon />}
										aria-controls="panel4bh-content"
										id="panel4bh-header"
									>
										<Typography sx={{ width: '50%', flexShrink: 0 }}>Foreclosure Team</Typography>
										<Typography sx={{ color: 'text.secondary' }}>48%</Typography>
									</AccordionSummary>
									<AccordionDetails>
										{/* Compliance Team Tasks*/}
										<Typography>Tasks</Typography>
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
														Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
														malesuada lacus ex, sit amet blandit leo lobortis eget.
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
														Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
														malesuada lacus ex, sit amet blandit leo lobortis eget.
													</Typography>
												</AccordionDetails>
											</Accordion>
										</Box>
									</AccordionDetails>
								</Accordion>
							</Box>
						</Grid>
					</Grid>
				</Box>
			</Dialog>
		</Box>
	)
}

export default ProjectsDrawer
