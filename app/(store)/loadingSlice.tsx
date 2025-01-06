import { createSlice } from '@reduxjs/toolkit';

const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    isLoading: false,
  },
  reducers: {
    showAbsoluteLoading: (state) => {
      state.isLoading = true;
    },
    hideAbsoluteLoading: (state) => {
      state.isLoading = false;
    },
  },
});

export const { showAbsoluteLoading, hideAbsoluteLoading } = loadingSlice.actions;
export default loadingSlice.reducer;