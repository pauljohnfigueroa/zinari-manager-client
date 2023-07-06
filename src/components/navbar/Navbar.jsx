import { useState } from 'react'
import {
	Box,
	IconButton,
	InputBase,
	Typography,
	Select,
	Menu,
	MenuItem,
	FormControl,
	useTheme,
	useMediaQuery,
	Avatar,
	Divider,
	ListItemIcon
} from '@mui/material'

/* Drawer */
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import MailIcon from '@mui/icons-material/Mail'

import {
	Search,
	Message,
	DarkMode,
	LightMode,
	Notifications,
	Help,
	Close,
	Logout
} from '@mui/icons-material'

import { useDispatch, useSelector } from 'react-redux'
import { setMode, setLogout } from 'state/authSlice'

import FlexBetween from 'components/FlexBetween'

const Navbar = () => {
	const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false)
	const dispatch = useDispatch()

	/* Pop up menu */
	const [anchorEl, setAnchorEl] = useState(null)

	/* Drawer state */
	const [drawerState, setDrawerState] = useState({
		top: false,
		left: false,
		bottom: false,
		right: false
	})

	// pull from global state
	const user = useSelector(state => state.auth.user)
	const isNonMobileScreens = useMediaQuery('(min-width: 600px)')

	const open = Boolean(anchorEl)

	const handleClick = event => {
		console.log('handleClick')
		setAnchorEl(event.currentTarget)
	}

	const handleProfile = () => {
		alert('handleProfile')
		setAnchorEl(null)
	}

	const handleClose = () => {
		setAnchorEl(null)
	}

	/* Drawer */
	const toggleDrawer = (anchor, open) => event => {
		if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
			return
		}
		setDrawerState({ ...drawerState, [anchor]: open })
	}
	/* Drawer list */
	const drawerList = anchor => (
		<Box
			sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
			role="presentation"
			onClick={toggleDrawer(anchor, false)}
			onKeyDown={toggleDrawer(anchor, false)}
		>
			<List>
				{['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
					<ListItem key={text} disablePadding>
						<ListItemButton>
							<ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
							<ListItemText primary={text} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
			<Divider />
			<List>
				{['All mail', 'Trash', 'Spam'].map((text, index) => (
					<ListItem key={text} disablePadding>
						<ListItemButton>
							<ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
							<ListItemText primary={text} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Box>
	)

	const theme = useTheme()
	const neutralLight = theme.palette.neutral.main
	const dark = theme.palette.neutral.dark
	const background = theme.palette.background.default

	const fullName = `${user.firstName} ${user.lastName}`

	/* Logout user */
	const handleClickLogout = () => {
		console.log('handleClickLogout')
		dispatch(setLogout())
	}

	return (
		<FlexBetween padding="1rem 5%" backgroundColor={background}>
			<FlexBetween gap="1.75rem">
				{isNonMobileScreens && (
					<FlexBetween
						backgroundColor={neutralLight}
						borderRadius="9px"
						gap="3rem"
						padding="0.1rem 1.5rem"
					>
						<InputBase placeholder="Search..." />
						<IconButton>
							<Search />
						</IconButton>
					</FlexBetween>
				)}
			</FlexBetween>

			{/* Desktop */}
			{isNonMobileScreens ? (
				<FlexBetween gap="2rem">
					{/* Flip Theme Mode */}
					<IconButton onClick={() => dispatch(setMode())}>
						{theme.palette.mode === 'dark' ? (
							<DarkMode sx={{ fontSize: '25px' }} />
						) : (
							<LightMode sx={{ color: dark, fontSize: '25px' }} />
						)}
					</IconButton>
					{/* Other icons */}
					<IconButton onClick={handleClick} size="small">
						<Message sx={{ fontSize: '25px' }} />
					</IconButton>
					<IconButton onClick={toggleDrawer('right', true)} size="small">
						<Notifications sx={{ fontSize: '25px' }} />
					</IconButton>
					<IconButton onClick={handleClick} size="small">
						<Help sx={{ fontSize: '25px' }} />
					</IconButton>
					{/* Avatar */}
					<IconButton
						onClick={handleClick}
						size="small"
						sx={{ ml: 2 }}
						aria-controls={open ? 'account-menu' : undefined}
						aria-haspopup="true"
						aria-expanded={open ? 'true' : undefined}
					>
						<Avatar
							alt={`${user.firstName} ${user.lastName}`}
							src={`/assets/images/${user.photo}`}
							sx={{ width: 24, height: 24 }}
						/>
					</IconButton>

					{/* Notifications drawer */}
					<Drawer anchor="right" open={drawerState['right']} onClose={toggleDrawer('right', false)}>
						{drawerList('right')}
					</Drawer>

					{/* Avatar pop up menu */}
					<Menu
						anchorEl={anchorEl}
						id="account-menu"
						open={open}
						onClose={handleClose}
						onClick={handleClose}
						PaperProps={{
							elevation: 0,
							sx: {
								overflow: 'visible',
								filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
								mt: 1.5,
								'& .MuiAvatar-root': {
									width: 32,
									height: 32,
									ml: -0.5,
									mr: 1
								},
								'&:before': {
									content: '""',
									display: 'block',
									position: 'absolute',
									top: 0,
									right: 14,
									width: 10,
									height: 10,
									bgcolor: 'background.paper',
									transform: 'translateY(-50%) rotate(45deg)',
									zIndex: 0
								}
							}
						}}
						transformOrigin={{ horizontal: 'right', vertical: 'top' }}
						anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
					>
						<MenuItem onClick={handleProfile}>
							<Avatar />
							Profile
						</MenuItem>
						<Divider />
						<MenuItem onClick={() => dispatch(setLogout())}>
							<ListItemIcon>
								<Logout fontSize="small" />
							</ListItemIcon>
							Logout
						</MenuItem>
					</Menu>
				</FlexBetween>
			) : (
				<IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
					<Menu />
				</IconButton>
			)}

			{/* MOBILE NAV */}
			{!isNonMobileScreens && isMobileMenuToggled && (
				<Box
					position="fixed"
					right="0"
					bottom="0"
					height="100%"
					zIndex="10"
					maxWidth="500px"
					minWidth="300px"
					backgroundColor={background}
				>
					{/* CLOSE ICON */}
					<Box display="flex" justifyContent="flex-end" p="1rem">
						<IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
							<Close />
						</IconButton>
					</Box>

					{/* MENU ITEMS */}
					<FlexBetween
						display="flex"
						flexDirection="column"
						justifyContent="center"
						alignItems="center"
						gap="3rem"
					>
						<IconButton onClick={() => dispatch(setMode())} sx={{ fontSize: '25px' }}>
							{theme.palette.mode === 'dark' ? (
								<DarkMode sx={{ fontSize: '25px' }} />
							) : (
								<LightMode sx={{ color: dark, fontSize: '25px' }} />
							)}
						</IconButton>
						<Message sx={{ fontSize: '25px' }} />
						<Notifications sx={{ fontSize: '25px' }} />
						<Help sx={{ fontSize: '25px' }} />
						<FormControl variant="standard" value={fullName}>
							<Select
								value={fullName}
								sx={{
									backgroundColor: neutralLight,
									width: '150px',
									borderRadius: '0.25rem',
									p: '0.25rem 1rem',
									'& .MuiSvgIcon-root': {
										pr: '0.25rem',
										width: '3rem'
									},
									'& .MuiSelect-select:focus': {
										backgroundColor: neutralLight
									}
								}}
								input={<InputBase />}
							>
								<MenuItem value={fullName}>
									<Typography>{fullName}</Typography>
								</MenuItem>
								<MenuItem onClick={handleClickLogout}>Log Out</MenuItem>
							</Select>
						</FormControl>
					</FlexBetween>
				</Box>
			)}
		</FlexBetween>
	)
}

export default Navbar
