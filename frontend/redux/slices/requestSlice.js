import { createSlice } from '@reduxjs/toolkit';
import { addRequest, getRequests, getRequestDetails, updateRequest, deleteRequest, getStaffRequests, updateVolumeRequested, inpatientDispense, outpatientDispense } from '../actions/requestActions';

export const requestSlice = createSlice({
  name: 'request',
  initialState: {
    request: [],
    loading: false, 
    error: null, 
    count: 0,
    requestDetails: {},
    isUpdated: false,
    isDeleted: false,
    message: null,
  },
  reducers: {
    resetRequestDetails: (state) => {
      state.requestDetails = {};
    },
    resetMessage: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(getRequests.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.request = action.payload.requests;
        state.count = action.payload.count;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(getRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
      })

      .addCase(addRequest.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(addRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
      })
      .addCase(addRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

       .addCase(updateRequest.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = action.payload.success;
      })
      .addCase(updateRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getRequestDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getRequestDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.requestDetails = action.payload.request;
      })
      .addCase(getRequestDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
      })

      .addCase(deleteRequest.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deleteRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.isDeleted = action.payload.success;
      })
      .addCase(deleteRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(getStaffRequests.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getStaffRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.request = action.payload.requests;
        state.count = action.payload.count;
      })
      .addCase(getStaffRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
      })

      .addCase(updateVolumeRequested.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateVolumeRequested.fulfilled, (state, action) => {
        state.loading = false;
        state.requestDetails = action.payload.request;
      })
      .addCase(updateVolumeRequested.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
      })
      
      .addCase(inpatientDispense.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(inpatientDispense.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(inpatientDispense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
      })
      
      .addCase(outpatientDispense.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(outpatientDispense.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(outpatientDispense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
      });
      
  },
});
export const { resetRequestDetails, resetMessage } = requestSlice.actions;
export default requestSlice.reducer;
