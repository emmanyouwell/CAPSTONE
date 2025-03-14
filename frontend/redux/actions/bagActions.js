import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { authenticate, getToken, logout } from '../../utils/helper';
import { REACT_APP_API_URL } from '@env';
export const createBag = createAsyncThunk(
    'bag/createBag',
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
        };

        try {
            let urlString = `${REACT_APP_API_URL}/api/v1/bag`;
           

            const response = await axios.post(urlString, req, config);

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);
export const getBags = createAsyncThunk(
    'bag/getBags',
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
        };

        try {
            let urlString = `${REACT_APP_API_URL}/api/v1/bag/donor/${req}`;
           

            const response = await axios.get(urlString, config);

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);
export const getSingleBag = createAsyncThunk(
    'bag/getSingleBag',
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
        };

        try {
            let urlString = `${REACT_APP_API_URL}/api/v1/bag/${req}`;
           

            const response = await axios.get(urlString, config);

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const updateBag = createAsyncThunk(
    'bag/updateBag',
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
        };

        try {
            let urlString = `${REACT_APP_API_URL}/api/v1/bag/${req.id}`;
           

            const response = await axios.put(urlString, req, config);

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const deleteBag = createAsyncThunk(
    'bag/deleteBag',
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
        };

        try {
            let urlString = `${REACT_APP_API_URL}/api/v1/bag/${req}`;
           

            const response = await axios.delete(urlString, config);

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);



