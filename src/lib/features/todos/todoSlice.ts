import { createSlice } from "@reduxjs/toolkit";

export interface Task {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}
export interface TodoState {
  value: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  value: [],
  loading: false,
  error: null,
};

export const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    // function to add initial todos to store
    addInitialItems: (state, action) => {
      state.value = action.payload;
    },
    // function to add a paraticulaar to from client
    add: (state, action) => {
      state.value = [...state.value, ...action.payload];
    },
    remove: (state, action) => {
      // function to delete a todo
      state.value = action.payload;
    },
    updateTask: (state, action) => {
      // function to update the completed status from homepage
      const index = state.value.findIndex(
        (todo) => todo.id === action.payload.id
      );
      if (index >= 0) {
        state.value[index] = { ...state.value[index], ...action.payload };
      }
    },
    updateTodo: (state, action) => {
      // function to update the position of todo after drag and drop
      state.value = action.payload;
    },
  },
});

export const { add, remove, updateTask, addInitialItems, updateTodo } =
  todoSlice.actions;

export default todoSlice.reducer;
