import { createSlice } from "@reduxjs/toolkit";
import {
  getCollectionDetails,
  recordPrivateRecord,
  recordPublicRecord,
} from "../actions/collectionActions";

export const collectionSlice = createSlice({
  name: "collection",
  initialState: {
    message: "",
    loading: false,
    error: null,
    success: false,
    collectionDetails: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(recordPublicRecord.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(recordPublicRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(recordPublicRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(recordPrivateRecord.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(recordPrivateRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(recordPrivateRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getCollectionDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getCollectionDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.collectionDetails = action.payload.collection;
      })
      .addCase(getCollectionDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default collectionSlice.reducer;
