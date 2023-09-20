import { useState } from 'react'
import { Box, useMediaQuery } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Navbar from 'components/navbar/Navbar'
import Sidebar from 'components/sidebar/Sidebar'

function Layout({ authPermissions }) {
	const isNonMobile = useMediaQuery('(min-width: 600px)')
	const [isSidebarOpen, setIsSidebarOpen] = useState(true)

	return (
		<Box
			display={isNonMobile ? 'flex' : 'block'}
			width="100%"
			height="100%"
		>
			<Sidebar
				isNonMobile={isNonMobile}
				drawerWidth="250px"
				isSidebarOpen={isSidebarOpen}
				setIsSidebarOpen={setIsSidebarOpen}
				authPermissions={authPermissions}
			/>
			<Box flexGrow={1}>
				<Navbar
					isSidebarOpen={isSidebarOpen}
					setIsSidebarOpen={setIsSidebarOpen}
					authPermissions={authPermissions}
				/>
				<Outlet />
			</Box>
		</Box>
	)
}

export default Layout
