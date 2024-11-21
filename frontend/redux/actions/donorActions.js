import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { authenticate, getToken, logout } from '../../utils/helper';
import { REACT_APP_API_URL } from '@env';

export const getDonors = createAsyncThunk(
    'donor/getDonors',
    async (query, thunkAPI) => {
        
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
            withCredentials: true
        }
        try {
            let urlString = ''
            if (query){
                urlString = `${REACT_APP_API_URL}/api/v1/donors?search=${query}`
            }
            else {
                urlString = `${REACT_APP_API_URL}/api/v1/donors`
            }
            const response = await axios.get(urlString, config);

            return response.data;

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
            logout(() => { });
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