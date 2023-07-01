import { Avatar, Box, Drawer, IconButton, List, Typography, Divider, useTheme } from '@mui/material'

import { ChevronLeft, Dashboard } from '@mui/icons-material'

import InboxIcon from '@mui/icons-material/MoveToInbox'
import FlexBetween from 'components/FlexBetween'

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
	const theme = useTheme() // from the ThemeProvider
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

						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								gap: 2,
								alignItems: 'center',
								margin: '20px 0 20px 0'
							}}
						>
							<Avatar alt="Paul Figueroa" src="/assets/paul.jpg" sx={{ width: 64, height: 64 }} />
							<Typography sx={{ fontSize: 14 }}>Paul Figueroa</Typography>
						</Box>
						<Divider />
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
