import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import List from '@mui/material/List'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'

/* Drawer */
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import ListItem from '@mui/material/ListItem'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

/* Pagination */
import Pagination from '@mui/material/Pagination'
import CommentListItem from 'components/list/CommentListItem'
import { ButtonGroup } from '@mui/material'

import { useTheme } from '@emotion/react'
import { tokens } from '../../theme.js'

const TasksDrawer = ({ openTaskDetailDialog, setOpenTaskDetailDialog, initFormValues }) => {
	const theme = useTheme()
	const colors = tokens(theme.palette.mode)

	const user = useSelector(state => state.auth.user)
	const token = useSelector(state => state.auth.token)
	const [commentMessage, setCommentMessage] = useState('')
	const [taskComments, setTaskComments] = useState([])
	const [taskDetails, setTaskDetails] = useState([])

	const handleClose = () => {
		setOpenTaskDetailDialog(false)
	}

	const handleCommentMessageChange = e => {
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
			const lastestComment = await response.json()
			console.log('lastestComment', lastestComment)
			// add the latest comment to the previous state
			if (lastestComment.length > 0) {
				setTaskComments(prev => [...prev, ...lastestComment])
				// This will not work as expected
				// setTaskComments({
				// 	taskId: taskId,
				// 	comments: [...taskComments[0].comments, ...fetchedComments]
				// })
				console.log('taskComments2', taskComments)
			}
		} catch (error) {
			console.log(error)
		}
		setCommentMessage('') // do not use null here
	}

	/* Fetch task's comments */
	useEffect(() => {
		const getTaskComments = async () => {
			try {
				const response = await fetch(
					`${process.env.REACT_APP_SERVER_URL}/tasks/${initFormValues._id}/comments`,
					{
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`
						}
					}
				)
				let comments = await response.json()

				// if there is an error, set the comment to a empty array
				if (comments.error) {
					// console.log(comments.error)
					comments = []
				}
				setTaskComments(comments)
				console.log('taskComments', taskComments)
			} catch (error) {
				console.log(error)
			}
		}
		getTaskComments()
		console.log(`Fetch task useEffect was called. ${initFormValues._id}`)
	}, [initFormValues._id, token])

	return (
		<Dialog fullScreen open={openTaskDetailDialog}>
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

			{/* Task header*/}
			<Box
				width="50%"
				marginX="auto"
				sx={{
					bgcolor: 'background.paper'
				}}
			>
				{/* Task Details*/}
				<Box
					sx={{
						//border: '1px dashed red',
						padding: 1
					}}
				>
					<Box sx={{ display: 'flex' }}>
						<Box
							sx={{
								width: '60%',
								margin: 1
								//border: '1px dashed blue'
							}}
						>
							<Box sx={{ display: 'flex' }}>
								<Typography>Owner:</Typography>
								<Typography>{initFormValues.owner}</Typography>
							</Box>
							<Box sx={{ display: 'flex' }}>
								<Typography>Project:</Typography>
								<Typography>{initFormValues.project}</Typography>
							</Box>
							<Box sx={{ display: 'flex' }}>
								<Typography>Team:</Typography>
								<Typography>{initFormValues.team}</Typography>
							</Box>
							<Box sx={{ display: 'flex' }}>
								<Typography>Priority:</Typography>
								<Typography>{initFormValues.priority}</Typography>
							</Box>
							<Box sx={{ display: 'flex' }}>
								<Typography>Perspective:</Typography>
								<Typography>{initFormValues.perspective}</Typography>
							</Box>
						</Box>
						<Box
							sx={{
								width: '40%',
								margin: 1
								//border: '1px dashed orange'
							}}
						>
							<Box sx={{ display: 'flex' }}>
								<Typography>Status:</Typography>
								<Typography>{initFormValues.status}</Typography>
							</Box>
							<Box sx={{ display: 'flex' }}>
								<Typography>Due Date:</Typography>
								<Typography>{initFormValues.dueDate}</Typography>
							</Box>
							<Box sx={{ display: 'flex' }}>
								<Typography>Completed:</Typography>
								<Typography>{initFormValues.dueDate}</Typography>
							</Box>
							<Box sx={{ display: 'flex' }}>
								<Typography>Remarks:</Typography>
								<Typography>OVERDUE</Typography>
							</Box>
						</Box>
					</Box>
					<Box sx={{ display: 'flex' }}>
						<Box
							sx={{
								display: 'flex',
								width: '60%',
								flexDirection: 'column',
								//border: '1px dashed green',
								margin: 1
							}}
						>
							<Typography>Instructions:</Typography>
							<Typography>{initFormValues.description}</Typography>
						</Box>
						<Box
							sx={{
								display: 'flex',
								width: '40%',
								// border: '1px dashed violet',
								margin: 1
							}}
						>
							<ButtonGroup>
								<Button>Mark for Review</Button>
							</ButtonGroup>
						</Box>
					</Box>
				</Box>

				{/* Comments */}
				<List
					sx={{
						width: '100%',
						bgcolor: 'background.paper'
					}}
				>
					<Typography sx={{ padding: 2 }}>Comments</Typography>
					{/* Task Comments  */}

					{taskComments.length > 0 && (
						<Stack spacing={2} paddingY={2}>
							<Pagination count={Math.ceil(taskComments.length / 5)} />
						</Stack>
					)}
					{taskComments.length > 0
						? taskComments.map(comment => <CommentListItem comment={comment} key={comment._id} />)
						: ''}

					{/* Comments pagination */}
					{taskComments.length > 0 && (
						<Stack spacing={2} paddingY={2}>
							<Pagination count={Math.ceil(taskComments.length / 5)} />
						</Stack>
					)}

					{/* Post a Comment*/}
					{initFormValues.status !== 'complete' && (
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
									onChange={handleCommentMessageChange}
								/>
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'space-between'
									}}
								>
									<Button variant="contained" onClick={() => handlePostComment(initFormValues._id)}>
										Post Comment
									</Button>
								</Box>
							</Box>
						</ListItem>
					)}
				</List>
			</Box>
		</Dialog>
	)
}

export default TasksDrawer
