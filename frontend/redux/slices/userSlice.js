import { createSlice } from '@reduxjs/toolkit';
import { loginUser, logoutUser, getUserDetails } from '../actions/userActions';
export const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLoggedIn: false,
    userDetails: null, // Store user information (e.g., name, email)
    token: null, // Store authentication token
    loading: false, // Useful for async actions like login/signup
    error: null, // To handle errors
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      // Pending: When the async action starts
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Fulfilled: When the async action succeeds
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.userDetails = action.payload.user;
        state.token = action.payload.token;
      })
      // Rejected: When the async action fails
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // The error message passed in rejectWithValue
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.userDetails = null;
        state.token = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(getUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.userDetails = action.payload.user;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
      
  },
});


export default userSlice.reducer;
