import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { authenticate, getToken, logout } from '../../utils/helper';
import { REACT_APP_API_URL } from '@env';
// import {server} from '../store';
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (credentials, thunkAPI) => {
    const { email, password } = credentials;
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true
    };
    try {
      console.log(`${REACT_APP_API_URL}/api/v1/login`);
      const response = await axios.post(`${REACT_APP_API_URL}/api/v1/login`, { email, password }, config);
      authenticate(response.data, ()=>{});
      return response;

    } catch (error) {

      return thunkAPI.rejectWithValue(error.message);
    }
  }
)

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        `${REACT_APP_API_URL}/api/v1/logout`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Assuming the API uses cookies or session for auth
        }
      );
      logout(()=>{});
      return response.data; // Optionally return the response if necessary for further actions

    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getUserDetails = createAsyncThunk(
  'user/getUserDetails',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        `${REACT_APP_API_URL}/api/v1/me`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Assuming the API uses cookies or session for auth
        }
      );

      return response.data; // Optionally return the response if necessary for further actions

    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
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
    logoutReducer: (state) => {
      state.isLoggedIn = false;
      state.userDetails = null;
      state.token = null;
    },
    updateUserDetails: (state, action) => {
      state.userDetails = { ...state.userDetails, ...action.payload };
    },
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
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.userDetails = action.payload.user;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.error = action.payload;
      });
      
  },
});

export const {
  logoutReducer, updateUserDetails } = userSlice.actions;

export default userSlice.reducer;
