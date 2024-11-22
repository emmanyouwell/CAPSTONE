import { createSlice } from '@reduxjs/toolkit';
import { addEvents } from '../actions/eventActions';
export const eventSlice = createSlice({
  name: 'donor',
  initialState: {
        events: [],
        loading: false, // Useful for async actions like login/signup
        error: null, // To handle errors

  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(addEvents.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(addEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload.events;
      })
      .addCase(addEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
     
      
  },
});

export default eventSlice.reducer;
