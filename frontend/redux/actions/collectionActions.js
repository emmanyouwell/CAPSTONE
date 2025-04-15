import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getToken } from '../../utils/helper';
import { REACT_APP_API_URL } from '@env';

// Record Record Public Collection
export const recordPublicRecord = createAsyncThunk(
    'collection/recordPublicRecord',
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
        }
        try {

            const response = await axios.post(`http://192.168.1.24:4000/api/v1/record-public`, req, config)
            console.log("record public: ", response.data)
            return response.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

// Mark Attendance of donors
export const recordPrivateRecord = createAsyncThunk(
    'collection/recordPrivateRecord',
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
        }
        try {

            const response = await axios.post(`http://192.168.1.24:4000/api/v1/record-private`, req, config)
            console.log("record private: ", response.data)
            return response.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

// Get Collection Details
export const getCollectionDetails = createAsyncThunk(
    'collection/getCollectionDetails',
    async (id, thunkAPI) => {

        const token = await getToken();
        
        if (!token) {
            throw new Error('No token available');
        }
        console.log("Id: ", id)
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        }
        try {
            console.log("URL: ", `http://192.168.1.24:4000/api/v1/collection/${id}`)
            const response = await axios.get(`http://192.168.1.24:4000/api/v1/collection/${id}`, config)
            
            return response.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

// Get Collection Details
export const allCollections = createAsyncThunk(
    'collection/allCollections',
    async (_, thunkAPI) => {

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
        }
        try {
            const response = await axios.get(`http://192.168.1.24:4000/api/v1/collections`, config)

            return response.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(error.message);
        }
    }
)