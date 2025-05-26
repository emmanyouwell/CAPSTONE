import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { authenticate, getToken, logout } from '../../utils/helper';
import { REACT_APP_API_URL } from '@env';
// import {server as REACT_APP_API_URL} from '../store';
// import {REACT_APP_API_URL} from '../store';
import api from '../../api/axiosInstance'
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (credentials, thunkAPI) => {
    const { isEmp } = credentials;
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        'X-Client-Type': 'mobile'
      },
      
    };
    try {
      let url = `${REACT_APP_API_URL}/api/v1/login`;
      if (isEmp) {
        url = `${REACT_APP_API_URL}/api/v1/login/?emp=true`;
      }
      console.log("Login url: ", url);
      const response = await axios.post(url, credentials, config);

      await authenticate(response.data, () => { });``
      return response.data;

    } catch (error) {
      console.log('Error:', error.response.data.message);
      return thunkAPI.rejectWithValue(error.response.data.message);
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
           // Assuming the API uses cookies or session for auth
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

    const token = await getToken();
    console.log('Token Retrieved:', token);

    if (!token) {
      throw new Error('No token available');
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      
    }
    try {
      console.log("Getting user details");
      const response = await api.get(
        `${REACT_APP_API_URL}/api/v1/me`,
        config
      );

      return response.data; // Optionally return the response if necessary for further actions

    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


export const registerUser = createAsyncThunk(
  'user/registerUser',

  async (userData, thunkAPI) => {
    console.log("Registering User: ", userData);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      
    };
    try {

      const response = await api.post(`${REACT_APP_API_URL}/api/v1/register`, userData, config);
      await authenticate(response.data, () => { });
      return response;

    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
)