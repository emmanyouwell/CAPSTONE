import { createSlice } from '@reduxjs/toolkit';
import { createLetting, finalizeSession, getLettings, markAttendance } from '../actions/lettingActions';

export const lettingSlice = createSlice({
  name: 'letting',
  initialState: {
    lettings: [],
    message: '',
    loading: false,
    error: null, 
    success: false,
  },
  reducers: {
    resetSuccess: (state) => {
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createLetting.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createLetting.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(createLetting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(markAttendance.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(markAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(markAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(finalizeSession.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(finalizeSession.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(finalizeSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getLettings.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getLettings.fulfilled, (state, action) => {
        state.loading = false;
        state.lettings = action.payload.lettings;
      })
      .addCase(getLettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
      })

  },
});

export default lettingSlice.reducer;