import { createSlice } from '@reduxjs/toolkit';
import { approveSchedule, requestSchedule } from '../actions/scheduleActions';

export const lettingSlice = createSlice({
  name: 'schedule',
  initialState: {
    message: '',
    loading: false,
    error: null, 
    success: false,
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestSchedule.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(requestSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(requestSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(approveSchedule.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(approveSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(approveSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default lettingSlice.reducer;