/* 
    The slice contatins all related actions to manage the app state pertaining to Tasks.
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
        // The fetchTasks action is used to populate the Tasks DataGRid 
        // whenever a User loads the Tasks Dashboard, 
        // the dispatch is called from the useEffect hook
        // in the TasksGridWidget.jsx
        fetchTasks: (state, action) => {
            state.tasks = action.payload.tasks
        },
        // The createTask action is used to create a new Task
        // dispatched from the handleCreateTask function in the TaskForm.jsx component.
        createTask: (state, action) => {
            state.tasks = [...state.tasks, { ...action.payload.task }]
        },
        // The updateTask action is used to update a Task
        // dispatched from handleUpdateUser function in the TaskForm.jsx component.
        updateTask: (state, action) => {
            state.tasks = state.tasks.map(item => item._id === action.payload.task._id ? action.payload.task : item)
        },
        // The deleteTasks action is used to delete a single or multiple Tasks.
        // dispatched from handleDeleteTasks function in the Tasks.jsx component.
        deleteTasks: (state, action) => {
            state.tasks = state.tasks.filter(item => !action.payload.checkedIds.includes(item._id))
        },
        // The addTaskFormState action is used to track the Open/Closed state of the add/update form.
        // dispatched from openAddTaskForm function in the Tasks.jsx component.
        // dispatched from handleUpdateTask and handleCreateTask functions in the TasksForm.jsx component.
        // dispatched from showEditForm function in the TasksGridWidget.jsx component.
        addTaskFormState: (state, action) => {
            state.formState = action.payload.formState
        }

    }

})

export const { fetchTasks, createTask, updateTask, deleteTasks, addTaskFormState } = taskSlice.actions
export default taskSlice.reducer