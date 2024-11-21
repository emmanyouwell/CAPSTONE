import { createAsyncThunk } from '@reduxjs/toolkit';
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
      await authenticate(response.data, ()=>{});
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
      await logout();
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