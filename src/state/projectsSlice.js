/* 
    The slice contains all related actions to manage the app state pertaining to Projects.
*/
import { createSlice } from "@reduxjs/toolkit";

// Global app state
const initialState = {
    projects: [],
    formState: false
}

export const ProjectSlice = createSlice({
    name: "project",
    initialState,
    // Redux Toolkit allows us to write "mutating" logic in reducers. It
    // doesn't actually mutate the state because it uses the immer library,
    // which detects changes to a "draft state" and produces a brand new
    // immutable state based off those changes
    // reducer are functions that modify the global state
    reducers: {
        // The fetchProjects action is used to populate the Projects DataGRid 
        // whenever a User loads the Projects Dashboard, 
        // the dispatch is called from the useEffect hook
        // in the ProjectsGridWidget.jsx
        fetchProjects: (state, action) => {
            state.projects = action.payload.projects
        },
        // The createProject action is used to create a new Project
        // dispatched from the handleCreateProject function in the ProjectForm.jsx component.
        createProject: (state, action) => {
            state.projects = [...state.projects, { ...action.payload.project }]
        },
        // The updateProject action is used to update a Project
        // dispatched from handleUpdateUser function in the ProjectForm.jsx component.
        updateProject: (state, action) => {
            state.projects = state.projects.map(item => item._id === action.payload.project._id ? action.payload.Project : item)
        },
        // The deleteProjects action is used to delete a single or multiple Projects.
        // dispatched from handleDeleteProjects function in the Projects.jsx component.
        deleteProjects: (state, action) => {
            state.projects = state.projects.filter(item => !action.payload.checkedIds.includes(item._id))
        },
        // The addProjectFormState action is used to track the Open/Closed state of the add/update form.
        // dispatched from openAddProjectForm function in the Projects.jsx component.
        // dispatched from handleUpdateProject and handleCreateProject functions in the ProjectsForm.jsx component.
        // dispatched from showEditForm function in the ProjectsGridWidget.jsx component.
        addProjectFormState: (state, action) => {
            state.formState = action.payload.formState
        }

    }

})

export const { fetchProjects, createProject, updateProject, deleteProjects, addProjectFormState } = ProjectSlice.actions
export default ProjectSlice.reducer