import { useState, useEffect } from 'react'

import {
	Collapse,
	Divider,
	List,
	ListItem,
	ListItemIcon,
	ListItemButton,
	ListItemText
	// Typography
} from '@mui/material'

import { useLocation, useNavigate } from 'react-router-dom'

import { useTheme } from '@emotion/react'

import {
	ExpandLess,
	ExpandMore
	// ChevronRightOutlined
} from '@mui/icons-material'

const SidebarMenuItem = ({ name, link, Icon, items = [] }) => {
	const [activePath, setActivePath] = useState('')
	const navigate = useNavigate()
	const theme = useTheme()
	const { pathname } = useLocation() // the current path
	const isExpandable = items && items.length > 0
	const [open, setOpen] = useState()

	useEffect(() => {
		setActivePath(pathname.substring(1))
	}, [pathname])

	const handleToggleMenu = () => {
		setOpen(!open)
	}

	const lcText = link

	const menuItemRoot = (
		<>
			<ListItem onClick={handleToggleMenu}>
				<ListItemButton
					onClick={() => {
						link && navigate(`/${lcText}`)
						link && setActivePath(lcText)
					}}
					// change backgroundColor when selected
					sx={{
						backgroundColor: activePath === lcText ? theme.palette.neutral.main : 'transparent',
						color: activePath === lcText ? theme.palette.secondary : theme.palette.primary
					}}
				>
					{/* Display an icon if any */}
					{!!Icon && (
						<ListItemIcon
							sx={{
								ml: '.5rem',
								color:
									activePath === lcText ? theme.palette.primary[600] : theme.palette.secondary[200]
							}}
						>
							<Icon />
						</ListItemIcon>
					)}
					<ListItemText primary={name}>
						{activePath === lcText && <ExpandMore sx={{ ml: 'auto' }} />}
					</ListItemText>
					{/* Display the expand menu if the item has children */}
					{isExpandable && !open && <ExpandMore />}
					{isExpandable && open && <ExpandLess />}
				</ListItemButton>
			</ListItem>
		</>
	)

	const menuItemChildren = isExpandable ? (
		<Collapse in={open} timeout="auto" unmountOnExit>
			<List component="div" disablePadding>
				{items.map((item, index) => (
					<SidebarMenuItem {...item} key={index} />
				))}
			</List>
			<Divider />
		</Collapse>
	) : null

	return (
		<>
			{menuItemRoot}
			{menuItemChildren}
		</>
	)
}

export default SidebarMenuItem
