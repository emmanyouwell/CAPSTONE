import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { authenticate, getToken, logout } from '../../utils/helper';
import { REACT_APP_API_URL } from '@env';

export const getAnnouncement = createAsyncThunk(
    'article/getAnnouncement',
    async(query, thunkAPI) => {
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
            let urlString = ''
            if (query){
                urlString = `${REACT_APP_API_URL}/api/v1/announcements?search=${query}`
            }
            else {
                urlString = `${REACT_APP_API_URL}/api/v1/announcements`
            }
            const response = await axios.get(urlString, config);
            console.log("Response", response.data)
            console.log("URL: ", urlString)
            return response.data;
        }catch (error){
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const addAnnouncements = createAsyncThunk(
    'article/addAnnouncements',
    async(req, thunkAPI) => {
        
        const token = await getToken();
        if (!token) {
            throw new Error('No token available');
        }
        const config = {
            headers: {
                
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        }
        try {
            console.log("sending request");
            console.log(`${REACT_APP_API_URL}/api/v1/articles`)
            const response = await axios.post(`${REACT_APP_API_URL}/api/v1/announcements`, req, config);
            console.log("response: ", response);
            return response.data;
        }catch (error){
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const updateAnnouncements = createAsyncThunk(
    'article/updateAnnouncements',
    async(req, thunkAPI) => {
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
            const response = await axios.put(`${REACT_APP_API_URL}/api/v1/announcement/${req.id}`, req, config);
            return response.data;
        }catch (error){
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const deleteAnnouncement = createAsyncThunk(
    'article/deleteAnnouncement',
    async(id, thunkAPI) => {
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
            const response = await axios.delete(`${REACT_APP_API_URL}/api/v1/announcement/${id}`, config);
            return response.data;
        }catch (error){
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const getAnnouncementDetails = createAsyncThunk(
    'article/getAnnouncementDetails',
    async(id, thunkAPI) => {
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
            const response = await axios.get(`${REACT_APP_API_URL}/api/v1/announcement/${id}`, config);
            return response.data;
        }catch (error){
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)