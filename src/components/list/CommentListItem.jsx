import ListItem from '@mui/material/ListItem'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import { useTheme } from '@emotion/react'
import { tokens } from 'theme'

const CommentListItem = ({ comment }) => {
	const theme = useTheme()
	const colors = tokens(theme.palette.mode)
	return (
		<ListItem
			key={comment._id} // prop
			sx={{
				alignItems: 'flex-start'
			}}
		>
			<Box
				sx={{
					display: 'flex',
					gap: 2,
					minHeight: 100,
					height: '100%',
					width: '100%',
					alignItems: 'center',
					padding: 1,
					backgroundColor: colors.grey[900],
					borderRadius: '4px'
				}}
			>
				{/* avatar */}
				<Box
					sx={{
						display: 'flex',
						gap: 1,
						minWidth: '64px',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center'
					}}
				>
					<Avatar
						alt={`${comment.user}`} // prop
						src={comment.avatar} // prop
						sx={{ width: 48, height: 48 }}
					/>
					<Typography sx={{ fontSize: '10px', textAlign: 'center' }}>
						{/* prop */}
						{comment.user}
					</Typography>{' '}
				</Box>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						width: '100%',
						alignItems: 'start',
						justifyContent: 'start'
					}}
				>
					<Typography
						sx={{
							color: 'gray',
							fontSize: 12,
							paddingBottom: 1
						}}
					>
						{/* prop */}
						{comment.lastModified}
					</Typography>
					<Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
						{/* the comment */}
						{comment.comment}
						{/* prop */}
					</Typography>
				</Box>
			</Box>
		</ListItem>
	)
}

export default CommentListItem
