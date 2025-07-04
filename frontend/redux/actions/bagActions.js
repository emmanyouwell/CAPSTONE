import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { authenticate, getToken, logout } from '../../utils/helper';
import { REACT_APP_API_URL } from '@env';
import api from '../../api/axiosInstance';
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
            let urlString = `/api/v1/bag`;
           

            const response = await api.post(urlString, req, config);

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
            let urlString = `/api/v1/bag/donor/${req}`;
           

            const response = await api.get(urlString, config);

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
            let urlString = `/api/v1/bag/${req}`;
           

            const response = await api.get(urlString, config);

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
            let urlString = `/api/v1/bag/${req.id}`;
           

            const response = await api.put(urlString, req, config);

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
            let urlString = `/api/v1/bag/${req}`;
           

            const response = await api.delete(urlString, config);

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


export const getAllBags = createAsyncThunk(
    'bag/getAllBags',
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
            const urlString = `/api/v1/bags`;

            const response = await api.get(urlString, config);

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


export const updateTemp = createAsyncThunk(
    'bag/updateTemp',
    async (req, thunkAPI) => {
        const token = await getToken();

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
            let urlString = `/api/v1/bag/${req.id}`;
           
            const response = await api.post(urlString, req, config);

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);