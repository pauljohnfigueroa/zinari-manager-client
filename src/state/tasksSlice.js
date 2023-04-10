/* 
    Recommended Articles
    https://www.meltstudio.co/post/react-apps-with-redux-toolkit-and-a-short-guide-to-reducers-with-createslice
    https://snyk.io/advisor/npm-package/redux-persist/functions/redux-persist.persistCombineReducers
*/
import { createSlice } from "@reduxjs/toolkit";

// Global app state
const initialState = {
    tasks: [],
    formState: false
}

export const taskSlice = createSlice({
    name: "task",
    initialState,

    // Redux Toolkit allows us to write "mutating" logic in reducers. It
    // doesn't actually mutate the state because it uses the immer library,
    // which detects changes to a "draft state" and produces a brand new
    // immutable state based off those changes
    // reducer are functions that modify the global state
    reducers: {
        fetchTasks: (state, action) => {
            state.tasks = action.payload.tasks
        },
        createTask: (state, action) => {
            state.tasks = [...state.tasks, { ...action.payload.task }]
        },
        updateTask: (state, action) => {
            state.tasks = state.tasks.map(item => item._id === action.payload.task._id ? action.payload.task : item)
        },
        deleteTasks: (state, action) => {
            state.tasks = state.tasks.filter(item => !action.payload.checkedIds.includes(item._id))
        },
        // Is the Task add/update form Open/Close 
        addTaskFormState: (state, action) => {
            state.formState = action.payload.formState
        }

    }

})

export const { fetchTasks, createTask, updateTask, deleteTasks, addTaskFormState } = taskSlice.actions
export default taskSlice.reducer