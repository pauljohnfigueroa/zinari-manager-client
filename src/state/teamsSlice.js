/* 
    The slice contatins all related actions to manage the app state pertaining to Teams.
*/
import { createSlice } from "@reduxjs/toolkit";

// Global app state
const initialState = {
    teams: [],
    formState: false
}

export const TeamSlice = createSlice({
    name: "team",
    initialState,
    // Redux Toolkit allows us to write "mutating" logic in reducers. It
    // doesn't actually mutate the state because it uses the immer library,
    // which detects changes to a "draft state" and produces a brand new
    // immutable state based off those changes
    // reducer are functions that modify the global state
    reducers: {
        // The fetchTeams action is used to populate the Teams DataGRid 
        // whenever a User loads the Teams Dashboard, 
        // the dispatch is called from the useEffect hook
        // in the TeamsGridWidget.jsx
        fetchTeams: (state, action) => {
            state.teams = action.payload.teams
        },
        // The createTeam action is used to create a new Team
        // dispatched from the handleCreateTeam function in the TeamForm.jsx component.
        createTeam: (state, action) => {
            state.teams = [...state.teams, { ...action.payload.team }]
        },
        // The updateTeam action is used to update a Team
        // dispatched from handleUpdateUser function in the TeamForm.jsx component.
        updateTeam: (state, action) => {
            state.teams = state.teams.map(item => item._id === action.payload.team._id ? action.payload.team : item)
        },
        // The deleteTeams action is used to delete a single or multiple Teams.
        // dispatched from handleDeleteTeams function in the Teams.jsx component.
        deleteTeams: (state, action) => {
            state.teams = state.teams.filter(item => !action.payload.checkedIds.includes(item._id))
        },
        // The addTeamFormState action is used to track the Open/Closed state of the add/update form.
        // dispatched from openAddTeamForm function in the Teams.jsx component.
        // dispatched from handleUpdateTeam and handleCreateTeam functions in the TeamsForm.jsx component.
        // dispatched from showEditForm function in the TeamsGridWidget.jsx component.
        addTeamFormState: (state, action) => {
            state.formState = action.payload.formState
        }

    }

})

export const { fetchTeams, createTeam, updateTeam, deleteTeams, addTeamFormState } = TeamSlice.actions
export default TeamSlice.reducer