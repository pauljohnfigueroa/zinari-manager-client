import { createSlice } from "@reduxjs/toolkit";

// Global app state
const initialState = {
    mode: "light",
    user: null,
    token: null,

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
        }
    }

})

export const { setMode, setLogin, setLogout, setFriends } = authSlice.actions
export default authSlice.reducer