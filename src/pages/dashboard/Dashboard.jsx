import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'

import ComplexCard from 'components/cards/ComplexCard'
import FlexBetween from 'components/FlexBetween'

import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

// Nivo calendar
import { ResponsiveCalendar } from '@nivo/calendar'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsivePie } from '@nivo/pie'

import { calendarData } from '../../data/calendar-data'
import { barData } from 'data/bar'
import { pieData } from 'data/pie'

// import { useSelector } from 'react-redux'

import TabPanel from 'components/tabs/TabPanel'

const Dashboard = () => {
	// const user = useSelector(state => state.auth.user)
	const [value, setValue] = useState(0)

	function a11yProps(index) {
		return {
			id: `simple-tab-${index}`,
			'aria-controls': `simple-tabpanel-${index}`
		}
	}

	const handleTabsChange = (event, newValue) => {
		setValue(newValue)
	}

	return (
		<Box sx={{ padding: '20px' }}>
			<FlexBetween>
				<Card sx={{ minWidth: 275 }}>
					<CardContent>
						<Typography
							sx={{ fontSize: 24 }}
							color="text.secondary"
							gutterBottom
						>
							Tasks Completed
						</Typography>
						<Typography
							sx={{ fontSize: 24 }}
							color="text.secondary"
							gutterBottom
						>
							344
						</Typography>
					</CardContent>
				</Card>
				<Card sx={{ minWidth: 275 }}>
					<CardContent>
						<Typography
							sx={{ fontSize: 24 }}
							color="text.secondary"
							gutterBottom
						>
							Overdue Tasks
						</Typography>
						<Typography
							sx={{ fontSize: 24 }}
							color="text.secondary"
							gutterBottom
						>
							100
						</Typography>
					</CardContent>
				</Card>
				<Card sx={{ minWidth: 275 }}>
					<CardContent>
						<Typography
							sx={{ fontSize: 24 }}
							color="text.secondary"
							gutterBottom
						>
							Overdue Tasks
						</Typography>
						<Typography
							sx={{ fontSize: 24 }}
							color="text.secondary"
							gutterBottom
						>
							100
						</Typography>
					</CardContent>
				</Card>
			</FlexBetween>
			<FlexBetween>
				<Box sx={{ margin: '20px 0', width: '50%', height: '300px' }}>
					<Card sx={{ minWidth: 275, height: '300px' }}>
						<CardContent sx={{ height: '300px' }}>
							<Typography>Lorem Ipsum Bar</Typography>
							<ResponsiveBar
								data={barData}
								keys={['hot dog', 'burger', 'sandwich', 'kebab', 'fries', 'donut']}
								indexBy="country"
								margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
								padding={0.3}
								valueScale={{ type: 'linear' }}
								indexScale={{ type: 'band', round: true }}
								colors={{ scheme: 'nivo' }}
								defs={[
									{
										id: 'dots',
										type: 'patternDots',
										background: 'inherit',
										color: '#38bcb2',
										size: 4,
										padding: 1,
										stagger: true
									},
									{
										id: 'lines',
										type: 'patternLines',
										background: 'inherit',
										color: '#eed312',
										rotation: -45,
										lineWidth: 6,
										spacing: 10
									}
								]}
								fill={[
									{
										match: {
											id: 'fries'
										},
										id: 'dots'
									},
									{
										match: {
											id: 'sandwich'
										},
										id: 'lines'
									}
								]}
								borderColor={{
									from: 'color',
									modifiers: [['darker', 1.6]]
								}}
								axisTop={null}
								axisRight={null}
								axisBottom={{
									tickSize: 5,
									tickPadding: 5,
									tickRotation: 0,
									legend: 'country',
									legendPosition: 'middle',
									legendOffset: 32
								}}
								axisLeft={{
									tickSize: 5,
									tickPadding: 5,
									tickRotation: 0,
									legend: 'food',
									legendPosition: 'middle',
									legendOffset: -40
								}}
								labelSkipWidth={12}
								labelSkipHeight={12}
								labelTextColor={{
									from: 'color',
									modifiers: [['darker', 1.6]]
								}}
								legends={[
									{
										dataFrom: 'keys',
										anchor: 'bottom-right',
										direction: 'column',
										justify: false,
										translateX: 120,
										translateY: 0,
										itemsSpacing: 2,
										itemWidth: 100,
										itemHeight: 20,
										itemDirection: 'left-to-right',
										itemOpacity: 0.85,
										symbolSize: 20,
										effects: [
											{
												on: 'hover',
												style: {
													itemOpacity: 1
												}
											}
										]
									}
								]}
								role="application"
								ariaLabel="Nivo bar chart demo"
								barAriaLabel={e => e.id + ': ' + e.formattedValue + ' in country: ' + e.indexValue}
							/>
						</CardContent>
					</Card>
				</Box>
				{/* Pie */}
				<Box sx={{ margin: 'auto 20px', width: '50%', height: '300px' }}>
					<Card sx={{ minWidth: 275, height: '300px' }}>
						<CardContent sx={{ height: '300px' }}>
							<Typography>Lorem ipsum Pie</Typography>
							<ResponsivePie
								data={pieData}
								margin={{ top: 40, right: 60, bottom: 80, left: 100 }}
								innerRadius={0.5}
								padAngle={0.7}
								cornerRadius={3}
								activeOuterRadiusOffset={8}
								borderWidth={1}
								borderColor={{
									from: 'color',
									modifiers: [['darker', 0.2]]
								}}
								arcLinkLabelsSkipAngle={10}
								arcLinkLabelsTextColor="#333333"
								arcLinkLabelsThickness={2}
								arcLinkLabelsColor={{ from: 'color' }}
								arcLabelsSkipAngle={10}
								arcLabelsTextColor={{
									from: 'color',
									modifiers: [['darker', 2]]
								}}
								defs={[
									{
										id: 'dots',
										type: 'patternDots',
										background: 'inherit',
										color: 'rgba(255, 255, 255, 0.3)',
										size: 4,
										padding: 1,
										stagger: true
									},
									{
										id: 'lines',
										type: 'patternLines',
										background: 'inherit',
										color: 'rgba(255, 255, 255, 0.3)',
										rotation: -45,
										lineWidth: 6,
										spacing: 10
									}
								]}
								fill={[
									{
										match: {
											id: 'ruby'
										},
										id: 'dots'
									},
									{
										match: {
											id: 'c'
										},
										id: 'dots'
									},
									{
										match: {
											id: 'go'
										},
										id: 'dots'
									},
									{
										match: {
											id: 'python'
										},
										id: 'dots'
									},
									{
										match: {
											id: 'scala'
										},
										id: 'lines'
									},
									{
										match: {
											id: 'lisp'
										},
										id: 'lines'
									},
									{
										match: {
											id: 'elixir'
										},
										id: 'lines'
									},
									{
										match: {
											id: 'javascript'
										},
										id: 'lines'
									}
								]}
								legends={[
									{
										anchor: 'bottom',
										direction: 'row',
										justify: false,
										translateX: 0,
										translateY: 56,
										itemsSpacing: 0,
										itemWidth: 100,
										itemHeight: 18,
										itemTextColor: '#999',
										itemDirection: 'left-to-right',
										itemOpacity: 1,
										symbolSize: 18,
										symbolShape: 'circle',
										effects: [
											{
												on: 'hover',
												style: {
													itemTextColor: '#000'
												}
											}
										]
									}
								]}
							/>
						</CardContent>
					</Card>
				</Box>
			</FlexBetween>
			<FlexBetween>
				<Box sx={{ margin: 2, width: '100%', height: '300px' }}>
					<Card sx={{ minWidth: 275, height: '300px' }}>
						<CardContent sx={{ height: '300px' }}>
							<Typography>Verified Task Activities</Typography>
							<ResponsiveCalendar
								data={calendarData}
								from="2016-01-01"
								to="2016-07-12"
								emptyColor="#eeeeee"
								colors={['#61cdbb', '#97e3d5', '#e8c1a0', '#f47560']}
								margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
								yearSpacing={40}
								monthBorderColor="#ffffff"
								dayBorderWidth={2}
								dayBorderColor="#ffffff"
								legends={[
									{
										anchor: 'bottom-right',
										direction: 'row',
										translateY: 36,
										itemCount: 4,
										itemWidth: 42,
										itemHeight: 36,
										itemsSpacing: 14,
										itemDirection: 'right-to-left'
									}
								]}
							/>
						</CardContent>
					</Card>
				</Box>
			</FlexBetween>
			<FlexBetween>
				<Box sx={{ width: '100%' }}>
					<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
						<Tabs
							value={value}
							onChange={handleTabsChange}
							aria-label="basic tabs example"
						>
							<Tab
								label="Tasks"
								{...a11yProps(0)}
							/>
							<Tab
								label="Teams"
								{...a11yProps(1)}
							/>
							<Tab
								label="Projects"
								{...a11yProps(2)}
							/>
						</Tabs>
					</Box>
					<TabPanel
						value={value}
						index={0}
					>
						{/* <TasksGridWidget
              initFormValues={initFormValues}
              setInitFormValues={setInitFormValues}
            /> */}
					</TabPanel>
					<TabPanel
						value={value}
						index={1}
					>
						{/* <TeamsGridWidget
              initFormValues={initFormValues}
              setInitFormValues={setInitFormValues}
            /> */}
					</TabPanel>
					<TabPanel
						value={value}
						index={2}
					>
						{/* <ProjectsGridWidget
              initFormValues={initFormValues}
              setInitFormValues={setInitFormValues}
            /> */}
					</TabPanel>
				</Box>
			</FlexBetween>
		</Box>
	)
}

export default Dashboard
