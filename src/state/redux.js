import { createSlice } from "@reduxjs/toolkit";

// Global app state
const initialState = {
    mode: "light",
    user: null,
    token: null,
    tasks: []
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
        setFriends: (state, action) => {
            if (state.user) {
                state.user.friends = action.payload.friends
            } else {
                console.error("User's friends are non-existent.")
            }
        },
        setTasks: (state, action) => {
            state.tasks = action.payload.tasks
        },
        setTask: (state, action) => {
            const updatedTasks = state.tasks.map(task => {
                if (task._id === action.payload.task._id) return action.payload.task

                return task
            })
            state.tasks = updatedTasks
        }
    }

})

export const { setMode, setLogin, setLogout, setFriends, setTasks, setTask } = authSlice.actions
export default authSlice.reducer