import { createSlice } from "@reduxjs/toolkit";

// Global app state
const initialState = {
    mode: "light",
    user: null,
    token: null,
    tasks: [],
    formState: false
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    // reducer are functions that modify the global state
    reducers: {
        // change theme to light or dark mode
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light"
        },
        setLogin: (state, action) => {
            state.user = action.payload.user
            state.token = action.payload.token
        },
        setLogout: (state) => {
            state.user = null
            state.token = null
        },
        fetchTasks: (state, action) => {
            state.tasks = action.payload.tasks
        },
        createTask: (state, action) => {
            state.tasks = [...state, ...action.payload]
        },
        addTaskFormState: (state, action) => {
            state.formState = action.payload.formState
        }
    }

})

export const { setMode, setLogin, setLogout, setFriends, fetchTasks, setTask, addTaskFormState } = authSlice.actions
export default authSlice.reducer