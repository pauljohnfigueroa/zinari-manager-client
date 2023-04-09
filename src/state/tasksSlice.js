import { createSlice } from "@reduxjs/toolkit";

// Global app state
const initialState = {
    tasks: [],
    formState: false
}

export const taskSlice = createSlice({
    name: "tasks",
    initialState,
    // reducer are functions that modify the global state
    reducers: {
        fetchTasks: (state, action) => {
            state.tasks = action.payload.tasks
        },
        createTask: (state, action) => {
            state.tasks = [...state, ...action.payload.task]
        },
        addTaskFormState: (state, action) => {
            state.formState = action.payload.formState
        }
    }

})

export const { fetchTasks, createTask, addTaskFormState } = taskSlice.actions
export default taskSlice.reducer