import { createSlice } from '@reduxjs/toolkit';
import { approveSchedule, getDonorSchedules, requestSchedule } from '../actions/scheduleActions';

export const lettingSlice = createSlice({
  name: 'schedule',
  initialState: {
    message: '',
    loading: false,
    error: null, 
    success: false,
    schedules : [],
    count: 0,
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
      .addCase(getDonorSchedules.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getDonorSchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = action.payload.schedules;
        state.count = action.payload.count;
      })
      .addCase(getDonorSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default lettingSlice.reducer;