import { createSlice } from '@reduxjs/toolkit';
import { 
  addFridges, 
  deleteFridges,
  getFridgeDetails, 
  getFridges, 
  updateFridge
} from '../actions/fridgeActions';

export const fridgeSlice = createSlice({
  name: 'fridge',
  initialState: {
    fridges: [],
    loading: false, // Useful for async actions like login/signup
    error: null, // To handle errors
    fridgeDetails: {},
    isUpdated: false,
    isDeleted: false,
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(getFridges.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getFridges.fulfilled, (state, action) => {
        state.loading = false;
        state.fridges = action.payload.fridges;
      })
      .addCase(getFridges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
      })

      .addCase(addFridges.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(addFridges.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
      })
      .addCase(addFridges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

       .addCase(updateFridge.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateFridge.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = action.payload.success;
      })
      .addCase(updateFridge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getFridgeDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getFridgeDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.fridgeDetails = action.payload.fridge;
      })
      .addCase(getFridgeDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
      })

      .addCase(deleteFridges.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deleteFridges.fulfilled, (state, action) => {
        state.loading = false;
        state.isDeleted = action.payload.success;
      })
      .addCase(deleteFridges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
      
  },
});

export default fridgeSlice.reducer;
