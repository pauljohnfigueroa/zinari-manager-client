import {
	Box,
	// Divider,
	Drawer,
	IconButton,
	List,
	// ListItem,
	// ListItemButton,
	// ListItemIcon,
	// ListItemText,
	Typography,
	useTheme
} from '@mui/material'

import {
	ChevronLeft,
	// ChevronRightOutlined,
	// HomeOutlined,
	Dashboard
	// ShoppingCartOutlined,
	// Groups2Outlined,
	// ReceiptLongOutlined,
	// PointOfSaleOutlined
} from '@mui/icons-material'

import InboxIcon from '@mui/icons-material/MoveToInbox'
// import ExpandLess from '@mui/icons-material/ExpandLess'
// import ExpandMore from '@mui/icons-material/ExpandMore'
// import Collapse from '@mui/material/Collapse'
// import StarBorder from '@mui/icons-material/StarBorder'

// import { useState, useEffect } from 'react'
// import { useLocation, useNavigate } from 'react-router-dom'
import FlexBetween from 'components/FlexBetween'
// import profileImage from '../../assets/paul.jpg'

import SidebarMenuItem from './SidebarMenuItem'

const sidebarMenuItems = [
	{
		name: 'Dashboard',
		link: 'dashboard',
		Icon: Dashboard
	},
	{
		name: 'Projects',
		Icon: InboxIcon,
		items: [
			{
				name: 'Tasks',
				link: 'tasks',
				Icon: InboxIcon
			},
			{
				name: 'Teams',
				link: 'teams',
				Icon: InboxIcon
			},
			{
				name: 'Projects',
				link: 'projects',
				Icon: InboxIcon
			}
		]
	},
	{
		name: 'Performance',
		Icon: InboxIcon,
		items: [
			{
				name: 'Appraisals',
				link: 'appraisals',
				Icon: InboxIcon
			}
		]
	},
	{
		name: 'Users',
		Icon: Dashboard,
		items: [
			{
				name: 'Accounts',
				link: 'admin/users',
				Icon: Dashboard
			},
			{
				name: 'Roles',
				link: 'admin/roles',
				Icon: Dashboard
			}
		]
	}
]

const Sidebar = ({
	isNonMobile,
	drawerWidth,
	isSidebarOpen,
	setIsSidebarOpen,
	authPermissions
}) => {
	// const { pathname } = useLocation() // the current path
	// const [activePath, setActivePath] = useState('')
	// const [open, setOpen] = useState(true)
	// const navigate = useNavigate()
	const theme = useTheme() // from the ThemeProvider

	// useEffect(() => {
	// 	setActivePath(pathname.substring(1))
	// }, [pathname])

	// const handleToggleMenu = () => {
	// 	setOpen(!open)
	// }

	return (
		<Box component="nav">
			{isSidebarOpen && (
				<Drawer
					open={isSidebarOpen}
					onClose={() => setIsSidebarOpen(false)}
					variant="persistent"
					anchor="left"
					sx={{
						width: drawerWidth,
						'& .MuiDrawer-paper': {
							color: theme.palette.secondary[200],
							backgroundColor: theme.palette.background.alt,
							boxSizing: 'border-box',
							borderWidth: isNonMobile ? 0 : '2px',
							width: drawerWidth
						}
					}}
				>
					<Box width="100%">
						<Box m="1.5rem 2rem 2rem 3rem">
							<FlexBetween color={theme.palette.primary.main}>
								<Box display="flex" alignItems="center" gap="0.5rem">
									<Typography variant="h4" fontWeight="bold">
										Zinari
									</Typography>
								</Box>
								{!isNonMobile && (
									<IconButton
										onClick={() => {
											setIsSidebarOpen(!isSidebarOpen)
										}}
									>
										<ChevronLeft />
									</IconButton>
								)}
							</FlexBetween>
						</Box>

						<List>
							{sidebarMenuItems.map(({ name, link, Icon, items }, index) => {
								return (
									<SidebarMenuItem name={name} Icon={Icon} items={items} link={link} key={index} />
								)
							})}
						</List>
					</Box>
				</Drawer>
			)}
		</Box>
	)
}

export default Sidebar
