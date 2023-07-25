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

const TasksDrawer = ({ openTaskDetailDialog, setOpenTaskDetailDialog, initFormValues }) => {
	const user = useSelector(state => state.auth.user)
	const token = useSelector(state => state.auth.token)
	const [commentMessage, setCommentMessage] = useState('')
	const [taskComments, setTaskComments] = useState([])

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
			const fetchedComments = await response.json()

			// add the latest comment to the previous state
			if (fetchedComments.length > 0) {
				setTaskComments(prev => [
					{ taskId: taskId, comments: [...prev[0].comments, ...fetchedComments] }
				])
				// This will not work as expected
				// setTaskComments({
				// 	taskId: taskId,
				// 	comments: [...taskComments[0].comments, ...fetchedComments]
				// })
			}
		} catch (error) {
			console.log(error)
		}
		setCommentMessage('') // do not use null here
	}
	console.log('initFormValues', initFormValues)
	console.log('taskComments', taskComments)

	/* Fetch Task comments */
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
			} catch (error) {
				console.log(error)
			}
		}
		getTaskComments()
		console.log(`Fetch task useEffect was called. ${initFormValues._id}`)
	}, [initFormValues._id, token])

	return (
		<>
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
				<Box sx={{ paddingTop: 2 }}>
					{/* Tasks */}
					{/* Comments */}
					<List
						sx={{
							width: '100%',
							paddingRight: 1,
							bgcolor: 'background.paper'
						}}
					>
						{/* Task Comments  */}
						{taskComments.length > 0
							? taskComments.map(comment => <CommentListItem comment={comment} />)
							: ''}
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
					</List>
				</Box>
			</Dialog>
		</>
	)
}

export default TasksDrawer
