import { useState } from 'react'
import { Box } from '@mui/material'
import ComplexCard from 'components/cards/ComplexCard'
import FlexBetween from 'components/FlexBetween'

import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

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
        <Box sx={{ margin: 'auto 20px', width: '30%' }}>
          <ComplexCard
            title="Tasks Completion Rate"
            subheader="as of April 15, 2023"
            avatar="../assets/chart.jpg"
          />
        </Box>
        <Box sx={{ margin: 'auto 20px', width: '30%' }}>
          <ComplexCard
            title="Projects Completion Rate"
            subheader="as of April 15, 2023"
            avatar="../assets/line-graph.png"
          />
        </Box>
        <Box sx={{ margin: 'auto 20px', width: '30%' }}>
          <ComplexCard
            title="Teams"
            subheader="as of April 15, 2023"
            avatar="../assets/pie-chart.png"
          />
        </Box>
      </FlexBetween>
      <FlexBetween>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleTabsChange} aria-label="basic tabs example">
              <Tab label="Tasks" {...a11yProps(0)} />
              <Tab label="Teams" {...a11yProps(1)} />
              <Tab label="Projects" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            {/* <TasksGridWidget
              initFormValues={initFormValues}
              setInitFormValues={setInitFormValues}
            /> */}
          </TabPanel>
          <TabPanel value={value} index={1}>
            {/* <TeamsGridWidget
              initFormValues={initFormValues}
              setInitFormValues={setInitFormValues}
            /> */}
          </TabPanel>
          <TabPanel value={value} index={2}>
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
