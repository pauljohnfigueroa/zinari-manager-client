/* 
    The slice contatins all related actions to manage the app state pertaining to Roles.
*/
import { createSlice } from '@reduxjs/toolkit'

// Global app state
const initialState = {
  roles: [],
  formState: false
}

export const roleSlice = createSlice({
  name: 'role',
  initialState,
  // Redux Toolkit allows us to write "mutating" logic in reducers. It
  // doesn't actually mutate the state because it uses the immer library,
  // which detects changes to a "draft state" and produces a brand new
  // immutable state based off those changes
  // reducer are functions that modify the global state
  reducers: {
    // The fetchRoles action is used to populate the Roles DataGRid
    // whenever a User loads the Roles Dashboard,
    // the dispatch is called from the useEffect hook
    // in the RolesGridWidget.jsx
    fetchRoles: (state, action) => {
      state.roles = action.payload.roles
    },
    // The createRole action is used to create a new Role
    // dispatched from the handleCreateRole function in the RoleForm.jsx component.
    createRole: (state, action) => {
      state.roles = [...state.roles, { ...action.payload.role }]
    },
    // The updateRole action is used to update a Role
    // dispatched from handleUpdateUser function in the RoleForm.jsx component.
    updateRole: (state, action) => {
      state.roles = state.roles.map(item =>
        item._id === action.payload.role._id ? action.payload.role : item
      )
    },
    // The deleteRoles action is used to delete a single or multiple Roles.
    // dispatched from handleDeleteRoles function in the Roles.jsx component.
    deleteRoles: (state, action) => {
      state.roles = state.roles.filter(item => !action.payload.checkedIds.includes(item._id))
    },
    // The addRoleFormState action is used to track the Open/Closed state of the add/update form.
    // dispatched from openAddRoleForm function in the Roles.jsx component.
    // dispatched from handleUpdateRole and handleCreateRole functions in the RolesForm.jsx component.
    // dispatched from showEditForm function in the RolesGridWidget.jsx component.
    addRoleFormState: (state, action) => {
      state.formState = action.payload.formState
    }
  }
})

export const { fetchRoles, createRole, updateRole, deleteRoles, addRoleFormState } =
  roleSlice.actions
export default roleSlice.reducer
