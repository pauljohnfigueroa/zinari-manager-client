/* 
    The slice contatins all related actions to manage the app state pertaining to users.
*/
import { createSlice } from "@reduxjs/toolkit";

// Global app state
const initialState = {
    users: [],
    formState: false
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    // Redux Toolkit allows us to write "mutating" logic in reducers. It
    // doesn't actually mutate the state because it uses the immer library,
    // which detects changes to a "draft state" and produces a brand new
    // immutable state based off those changes
    // reducer are functions that modify the global state
    reducers: {
        // The fetchusers action is used to populate the users DataGRid 
        // whenever a User loads the users Dashboard, 
        // the dispatch is called from the useEffect hook
        // in the usersGridWidget.jsx
        fetchUsers: (state, action) => {
            state.users = action.payload.users
        },
        //
        fetchUsername: (state, action) => {
            state.users.email = action.payload.users.email
        },
        // The createuser action is used to create a new user
        // dispatched from the handleCreateuser function in the userForm.jsx component.
        createUser: (state, action) => {
            state.users = [...state.users, { ...action.payload.user }]
        },
        // The updateuser action is used to update a user
        // dispatched from handleUpdateUser function in the userForm.jsx component.
        updateUser: (state, action) => {
            state.users = state.users.map(item => item._id === action.payload.user._id ? action.payload.user : item)
        },
        // The deleteusers action is used to delete a single or multiple users.
        // dispatched from handleDeleteusers function in the users.jsx component.
        deleteUsers: (state, action) => {
            state.users = state.users.filter(item => !action.payload.checkedIds.includes(item._id))
        },
        // The adduserFormState action is used to track the Open/Closed state of the add/update form.
        // dispatched from openAdduserForm function in the users.jsx component.
        // dispatched from handleUpdateuser and handleCreateuser functions in the usersForm.jsx component.
        // dispatched from showEditForm function in the usersGridWidget.jsx component.
        addUserFormState: (state, action) => {
            state.formState = action.payload.formState
        }

    }

})

export const { fetchUsers, createUser, updateUser, deleteUsers, addUserFormState } = userSlice.actions
export default userSlice.reducer