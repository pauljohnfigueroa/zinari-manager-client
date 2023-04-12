/* 
The ProjectsGridWidget.jsx component is a datagrid where all Projects are listed.

Components

*/
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme } from '@emotion/react'

import { fetchProjects, addProjectFormState } from 'state/projectsSlice.js'
import ProjectForm from 'pages/projects/ProjectForm.jsx'
import { Box, IconButton } from '@mui/material'
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import LinearProgress from '@mui/material/LinearProgress'

import { setCheckedIds } from 'state/datagridSlice.js'

import { tokens } from '../theme.js'

const ProjectsGridWidget = ({ initFormValues, setInitFormValues }) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const dispatch = useDispatch()
  const projects = useSelector(state => state.project.projects)
  const formState = useSelector(state => state.project.formState)
  const token = useSelector(state => state.auth.token)

  /* FETCH ProjectS */
  useEffect(() => {
    // Backend
    const getProjects = async () => {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/projects`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      })
      const projects = await response.json()

      // Frontend
      /* Dispatch */
      dispatch(fetchProjects({ projects }))
    }
    getProjects()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /* UPDATE Project FORM */
  const showEditForm = row => {
    dispatch(addProjectFormState({ formState: true }))
    setInitFormValues(row)
  }

  /* GRID COLUMNS */
  const columns = [
    {
      field: '_id',
      headerName: 'ID'
    },
    {
      field: 'manager',
      headerName: 'Manager',
      flex: 1
    },
    {
      field: 'title',
      headerName: 'Title',
      flex: 1
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1
    },
    {
      field: 'teams',
      headerName: 'Teams',
      flex: 1
    },
    {
      field: 'tasks',
      headerName: 'Tasks',
      flex: 1
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      renderCell: rowdata => {
        return (
          <Box>
            <IconButton onClick={() => showEditForm(rowdata.row)}>
              <ModeEditOutlineOutlinedIcon />
            </IconButton>
          </Box>
        )
      }
    }
  ]

  return (
    <Box height="60vh">
      {formState && (
        <ProjectForm
          formLabel={initFormValues._id ? 'Update Project' : 'New Project'}
          initFormValues={initFormValues}
        />
      )}

      {/* DATAGRID */}
      <DataGrid
        getRowId={row => row._id}
        sx={{
          backgroundColor: colors.grey[800],
          '& .MuiDataGrid-row:hover': {
            color: colors.grey[400],
            backgroundColor: colors.primary.main
          }
        }}
        components={{
          Toolbar: GridToolbar,
          LoadingOverlay: LinearProgress
        }}
        rows={projects ? projects : []}
        columns={columns}
        checkboxSelection
        disableSelectionOnClick
        disableRowSelectionOnClick
        onRowSelectionModelChange={checkedIds => {
          // Pass the checked row ids to a redux state
          dispatch(setCheckedIds({ checkedIds }))
        }}
      />
    </Box>
  )
}

export default ProjectsGridWidget
