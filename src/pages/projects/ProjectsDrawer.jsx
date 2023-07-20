import { useState, useEffect, forwardRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTheme } from '@emotion/react'

import { Avatar, AvatarGroup, Box, TextField, Divider, Stack } from '@mui/material'
import Grid from '@mui/material/Grid'

import Typography from '@mui/material/Typography'

/* Drawer */
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import ListItem from '@mui/material/ListItem'
import List from '@mui/material/List'
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

import ProjectForm from '../../components/forms/ProjectForm'

import { tokens } from 'theme'
import TaskForm from 'components/forms/TaskForm'

import dayjs from 'dayjs'

import { addTaskFormState } from 'state/tasksSlice'

import ProjectsSummaryWidget from 'widgets/ProjectsSummaryWidget'

/* Pagination */
import Pagination from '@mui/material/Pagination'
import CommentListItem from 'components/list/CommentListItem'

/* Accordion */
const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="right" ref={ref} {...props} />
})

const ProjectsDrawer = ({ projDetailDialog, setProjDetailDialog, initFormValues }) => {
	const theme = useTheme()
	const colors = tokens(theme.palette.mode)

	const user = useSelector(state => state.auth.user)
	const token = useSelector(state => state.auth.token)

	/* Task Form */
	const open = useSelector(state => state.task.open)
	const dispatch = useDispatch()

	/* local states */
	const [teams, setTeams] = useState([])
	const [teamMembers, setTeamMembers] = useState([])
	const [currentTeam, setCurrentTeam] = useState([])
	const [tasks, setTasks] = useState([])
	const [taskComments, setTaskComments] = useState([])
	const [panelTeamId, setPanelTeamId] = useState(null)
	const [panelTaskId, setPanelTaskId] = useState(null)
	const [commentMessage, setCommentMessage] = useState('')

	/* Accordion state */
	const [teamPanelExpanded, setTeamPanelExpanded] = useState(false)
	const [taskPanelExpanded, setTaskPanelExpanded] = useState(false)

	/* Tasks form */
	const initialValues = {
		_id: null,
		title: '',
		description: '',
		project: initFormValues._id, // set to the current project id
		team: '',
		priority: '',
		owner: '',
		perspective: '',
		dueDate: dayjs().add(0, 'day')
	}

	/* Add Task to a Team */
	const handleAddTask = teamId => {
		const teamDetails = teamMembers.filter(team => team._id === teamId)
		setCurrentTeam(teamDetails[0])
		dispatch(addTaskFormState({ open: true }))
	}
	/* Remove Team from the Project */
	const handleRemoveTeam = teamId => {
		alert(teamId)
	}

	const handleCommentMessage = e => {
		setCommentMessage(e.target.value)
	}

	/* Post a comment */
	const handlePostComment = async taskId => {
		try {
			const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/tasks/comment`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ userId: user._id, taskId, comment: commentMessage })
			})
			// dispatch here
			const comments = await response.json()

			setTaskComments([{ taskId: taskId, comments }])
		} catch (error) {
			console.log(error)
		}
		setCommentMessage('') // do not use null here
	}

	// HOF
	const handleAccordionPanelChange = teamId => (event, isExpanded) => {
		setTeamPanelExpanded(isExpanded ? teamId : false)
		setPanelTeamId(teamId)
		console.log('handleAccordionPanelChange was called')
	}

	const handleAccordionTaskPanelChange = taskId => (event, isExpanded) => {
		setTaskPanelExpanded(isExpanded ? taskId : false)
		setPanelTaskId(taskId)
		console.log('handleAccordionTaskPanelChange was called')
	}

	const handleClose = () => {
		setProjDetailDialog(false)
	}

	console.log(commentMessage)

	/* Fetch project teams */
	useEffect(() => {
		const getProjTeams = async () => {
			const response = await fetch(
				`${process.env.REACT_APP_SERVER_URL}/projects/${initFormValues._id}/teams`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					}
				}
			)
			const projTeams = await response.json()
			setTeams(projTeams[0].projTeams)
		}
		getProjTeams()
	}, [initFormValues._id, token])

	/* Fetch team members, this is dependent to the project teams.  */
	useEffect(() => {
		const getTeamMembers = async () => {
			console.log('teams', teams)
			const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/projects/teams/members`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ teams })
			})
			const projTeam = await response.json()
			setTeamMembers(projTeam)
		}
		getTeamMembers()
	}, [teams, setTeamMembers, token])

	/* Fetch team's tasks */
	useEffect(() => {
		// we have to add the project Id
		const getTeamTasks = async () => {
			if (panelTeamId) {
				try {
					const response = await fetch(
						`${process.env.REACT_APP_SERVER_URL}/tasks/${initFormValues._id}/${panelTeamId}/tasks`,
						{
							method: 'GET',
							headers: {
								'Content-Type': 'application/json',
								Authorization: `Bearer ${token}`
							}
						}
					)
					const teamTasks = await response.json()

					// check if the Team accordion panel was already viewed before
					// if so, do not re-add the team's tasks
					if (tasks.length > 0) {
						let exists = false
						tasks.map(item => {
							if (item.teamId === panelTeamId) {
								exists = true
							}
							return item
						})
						console.log(exists)
						if (!exists) {
							setTasks([...tasks, { teamId: panelTeamId, teamTasks }])
						}
					} else {
						setTasks([{ teamId: panelTeamId, teamTasks }])
					}
				} catch (error) {
					console.log(error)
				}
			}
		}
		getTeamTasks()
	}, [panelTeamId, token, tasks])

	/* Fetch Task comments */
	useEffect(() => {
		const getTaskComments = async () => {
			if (panelTaskId) {
				try {
					const response = await fetch(
						`${process.env.REACT_APP_SERVER_URL}/tasks/${panelTaskId}/comments`,
						{
							method: 'GET',
							headers: {
								'Content-Type': 'application/json',
								Authorization: `Bearer ${token}`
							}
						}
					)
					const comments = await response.json()

					// check if the Team accordion panel was already viewed before
					// if so, do not re-add the team's tasks
					if (taskComments.length > 0) {
						let exists = false
						taskComments.map(item => {
							if (item.taskId === panelTaskId) {
								exists = true
							}
							return item
						})
						console.log(exists)
						if (!exists) {
							setTaskComments([...taskComments, { taskId: panelTaskId, comments }])
						}
					} else {
						setTaskComments([{ taskId: panelTaskId, comments }])
					}
				} catch (error) {
					console.log(error)
				}
			}
		}
		getTaskComments()
		console.log(`Fetch task useEffect was called. ${panelTaskId}`)
	}, [panelTaskId, token])

	console.log('taskComments', taskComments)
	console.log('tasks', tasks)

	return (
		<Box sx={{ flexGrow: 1 }}>
			{open && (
				<TaskForm formLabel="Add Task" initFormValues={initialValues} currentTeam={currentTeam} />
			)}
			{/* Drawer */}
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
						<Typography sx={{ ml: 2, flex: 1 }} variant="h3" component="div">
							{initFormValues.title}
						</Typography>
					</Toolbar>
				</AppBar>

				{/* Team and Task Container */}

				<Box sx={{ padding: 4 }}>
					<Grid container spacing={1}>
						{/* Project Summary */}
						<Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
							<Box
								sx={{
									border: `1px solid ${colors.grey[600]}`,
									height: '100%',
									padding: 2
								}}
							>
								<ProjectsSummaryWidget title="Summary" />
							</Box>
						</Grid>

						<Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
							{/* Project Form */}
							<Box
								sx={{
									border: `1px solid ${colors.grey[600]}`,
									height: '100%',
									padding: 2
								}}
							>
								<ProjectForm initFormValues={initFormValues} />
							</Box>
						</Grid>

						{/* Teams Accordion */}
						<Grid item xs={12} md={12} order={{ xs: 3, md: 3 }}>
							<Box>
								<Typography variant="h3" sx={{ paddingBottom: 1 }}>
									Teams
								</Typography>

								{teamMembers.map(team => {
									return (
										<Accordion
											key={team._id}
											expanded={teamPanelExpanded === team._id}
											onChange={handleAccordionPanelChange(team._id)}
										>
											<AccordionSummary
												expandIcon={<ExpandMoreIcon />}
												aria-controls={team.name}
												id={team._id}
											>
												<Typography variant="h4" sx={{ width: '50%', flexShrink: 0 }}>
													{team.name}
												</Typography>
											</AccordionSummary>
											<AccordionDetails>
												{/* Team leader and members */}
												<Box
													sx={{
														display: 'flex',
														justifyContent: 'space-between',
														paddingBottom: 4
													}}
												>
													<Box sx={{ display: 'flex', gap: 4 }}>
														{/* Team Leader */}
														<Box
															sx={{
																display: 'flex',
																flexDirection: 'column',
																alignItems: 'center'
															}}
														>
															<Typography variant="h6" sx={{ paddingBottom: 2 }}>
																Leader
															</Typography>

															{/* Team leader avatar */}
															<Avatar
																alt={`${team.teamLeader[0].firstName} ${team.teamLeader[0].lastName}`}
																src={`/assets/images/${team.teamLeader[0].photo}`}
																sx={{ width: 32, height: 32 }}
															/>
														</Box>
														{/* Team Members */}
														<Box
															sx={{
																display: 'flex',
																flexDirection: 'column',
																alignItems: 'start'
															}}
														>
															<Typography variant="h6" sx={{ paddingBottom: 2 }}>
																Members
															</Typography>
															{/* Team Members Avatar Group*/}
															<AvatarGroup
																max={5}
																variant="circular"
																sx={{
																	'& .MuiAvatarGroup-avatar': {
																		width: 32,
																		height: 32,
																		fontSize: '.8rem',
																		border: 'none'
																	}
																}}
															>
																{team.teamMembers.map(member => (
																	<Avatar
																		key={member._id}
																		alt={`${member.firstName} ${member.lastName}`}
																		src={`/assets/images/${member.photo}`}
																	/>
																))}
															</AvatarGroup>
														</Box>
													</Box>
													{/* Accordion panel actions */}
													<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
														<Button onClick={handleRemoveTeam}>Remove Team</Button>
														<Button onClick={() => handleAddTask(team._id)}>Add Task</Button>
													</Box>
												</Box>

												<Divider />
												{/* Task header*/}
												<Box sx={{ paddingTop: 2 }}>
													<Typography variant="h4">
														{tasks.map(item => {
															if (item.teamId === team._id) {
																return item.teamTasks.length > 0
																	? 'Tasks'
																	: 'The is currently no task here.'
															}
														})}
													</Typography>

													{/* Tasks */}
													{tasks.map(item => {
														if (item.teamId === team._id) {
															return item.teamTasks.map(task => {
																return (
																	<Accordion
																		key={task._id}
																		expanded={taskPanelExpanded === task._id}
																		onChange={handleAccordionTaskPanelChange(task._id)}
																	>
																		<AccordionSummary
																			expandIcon={<ExpandMoreIcon />}
																			aria-controls={`${task.title}-content`}
																			id={`${task.title}-header`}
																		>
																			<Typography>{task.title}</Typography>
																		</AccordionSummary>
																		<AccordionDetails>
																			{/* Action buttons */}
																			<Stack direction="row" spacing={2} marginBottom={2}>
																				<Button variant="contained" color="error">
																					Delete this Task
																				</Button>
																				<Button variant="contained" color="success">
																					Mark as Complete
																				</Button>
																			</Stack>

																			{/* Comments */}
																			<List
																				sx={{
																					width: '100%',
																					paddingRight: 1,
																					bgcolor: 'background.paper'
																				}}
																			>
																				{/* Task Comments  */}
																				{taskComments.map(item => {
																					if (item.taskId === task._id) {
																						return item.comments.map(comment => (
																							/* Comment List Items */
																							<CommentListItem comment={comment} />
																						))
																					}
																					return null
																				})}
																				{/* Comments pagination */}
																				<Stack spacing={2} paddingY={2}>
																					<Pagination count={10} />
																				</Stack>

																				{/* Post a Comment*/}
																				<ListItem>
																					<Box sx={{ width: '100%' }}>
																						<TextField
																							id="filled-multiline-flexible"
																							label="Comment"
																							placeholder="Type your comment here."
																							multiline
																							value={commentMessage}
																							minRows={3}
																							maxRows={3}
																							variant="outlined"
																							sx={{ width: '100%', paddingBottom: 1 }}
																							onChange={handleCommentMessage}
																						/>
																						<Box sx={{ display: 'flex', justifyContent: 'end' }}>
																							<Button
																								variant="contained"
																								onClick={() => handlePostComment(task._id)}
																							>
																								Post Comment
																							</Button>
																						</Box>
																					</Box>
																				</ListItem>
																			</List>
																		</AccordionDetails>
																	</Accordion>
																)
															})
														}
														// if this team
														return null
													})}
												</Box>
											</AccordionDetails>
										</Accordion>
									)
								})}
								{/* Other Accordions */}
							</Box>
						</Grid>
					</Grid>
				</Box>
			</Dialog>
		</Box>
	)
}

export default ProjectsDrawer
