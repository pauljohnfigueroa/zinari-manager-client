import { createSlice } from "@reduxjs/toolkit";

// Global app state
const initialState = {
    checkedIds: []
}

export const datagridSlice = createSlice({
    name: "datagrid",
    initialState,
    reducers: {

        // The row ids of the the selected datagrid rows.
        // This is used for deletion of rows and enable/disable the Delete Selected button
        // dispatched in the TasksGriidWidget.jsx
        setCheckedIds: (state, action) => {
            state.checkedIds = [...action.payload.checkedIds]
        }

    }
})

export const { setCheckedIds } = datagridSlice.actions
export default datagridSlice.reducer