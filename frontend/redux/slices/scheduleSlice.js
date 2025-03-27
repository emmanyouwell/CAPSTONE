import { createSlice } from "@reduxjs/toolkit";
import {
  approveSchedule,
  getDonorSchedules,
  getScheduleDetails,
  requestSchedule,
} from "../actions/scheduleActions";

export const scheduleSlice = createSlice({
  name: "schedule",
  initialState: {
    message: "",
    loading: false,
    error: null,
    success: false,
    schedules: [],
    scheduleDetails: {},
    count: 0,
  },
  reducers: {
    resetSuccess: (state) => {
      state.success = false;
    },
    resetScheduleDetails: (state) => {
      state.scheduleDetails = {};
    },
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

      .addCase(getScheduleDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getScheduleDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.scheduleDetails = action.payload.schedule;
      })
      .addCase(getScheduleDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetSuccess, resetScheduleDetails } = scheduleSlice.actions;
export default scheduleSlice.reducer;
