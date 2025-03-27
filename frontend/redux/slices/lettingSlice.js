import { createSlice } from "@reduxjs/toolkit";
import {
  createLetting,
  deleteLetting,
  finalizeSession,
  getLettingDetails,
  getLettings,
  getUpcomingLettings,
  markAttendance,
  newPublicDonor,
  updateLetting,
} from "../actions/lettingActions";

export const lettingSlice = createSlice({
  name: "letting",
  initialState: {
    lettings: [],
    message: "",
    newDonor: {},
    lettingDetails: {},
    loading: false,
    error: null,
    success: false,
    isUpdated: false,
    isDeleted: false,
  },
  reducers: {
    resetSuccess: (state) => {
      state.success = false;
    },
    resetError: (state) => {
      state.error = null;
    },
    resetLettingDetails: (state) => {
      state.lettingDetails = {};
    },
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

      .addCase(newPublicDonor.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(newPublicDonor.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
        state.newDonor = action.payload.donor;
      })
      .addCase(newPublicDonor.rejected, (state, action) => {
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
      .addCase(getUpcomingLettings.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getUpcomingLettings.fulfilled, (state, action) => {
        state.loading = false;
        state.lettings = action.payload.events;
      })
      .addCase(getUpcomingLettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getLettingDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getLettingDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.lettingDetails = action.payload.letting;
      })
      .addCase(getLettingDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteLetting.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deleteLetting.fulfilled, (state, action) => {
        state.loading = false;
        state.isDeleted = action.payload.success;
      })
      .addCase(deleteLetting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateLetting.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateLetting.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = action.payload.success;
      })
      .addCase(updateLetting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { resetSuccess, resetError, resetLettingDetails } = lettingSlice.actions;
export default lettingSlice.reducer;
