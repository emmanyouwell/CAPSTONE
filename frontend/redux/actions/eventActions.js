import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { authenticate, getToken, logout } from '../../utils/helper';
import { REACT_APP_API_URL } from '@env';

export const getEvents = createAsyncThunk(
    'event/getEvents',
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
            if (query) {
                urlString = `${REACT_APP_API_URL}/api/v1/donors?search=${query}`
            }
            else {
                urlString = `${REACT_APP_API_URL}/api/v1/donors`
            }
            console.log('URL:', urlString);
            const response = await axios.get(urlString, config);

            return response.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(error.message);
        }
    }
)


export const addEvents = createAsyncThunk(
    'event/addEvents',
    async (req, thunkAPI) => {

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
            
            
            const response = await axios.post(`${REACT_APP_API_URL}/api/v1/events`,req, config);

            return response.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(error.message);
        }
    }
)