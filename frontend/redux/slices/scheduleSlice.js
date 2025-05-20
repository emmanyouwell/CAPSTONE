import { createSlice } from "@reduxjs/toolkit";
import {
  approveSchedule,
  getAllSchedules,
  getDonorSchedules,
  getScheduleDetails,
  requestSchedule,
  updateSchedule,
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
    resetError: (state) => {
      state.error = null;
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
      })
      
      .addCase(getAllSchedules.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAllSchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = action.payload.schedules;
      })
      .addCase(getAllSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(updateSchedule.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.scheduleDetails = action.payload.schedule;
      })
      .addCase(updateSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetSuccess, resetScheduleDetails, resetError } = scheduleSlice.actions;
export default scheduleSlice.reducer;
