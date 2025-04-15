import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { authenticate, getToken, logout } from '../../utils/helper';
import { REACT_APP_API_URL } from '@env';

export const getArticles = createAsyncThunk(
    'article/getArticles',
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
                urlString = `http://192.168.1.24:4000/api/v1/articles?search=${query}`
            }
            else {
                urlString = `http://192.168.1.24:4000/api/v1/articles`
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

export const addArticles = createAsyncThunk(
    'article/addArticles',
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
            console.log(`http://192.168.1.24:4000/api/v1/articles`)
            const response = await axios.post(`http://192.168.1.24:4000/api/v1/articles`, req, config);
            console.log("response: ", response);
            return response.data;
        }catch (error){
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const updateArticle = createAsyncThunk(
    'article/updateArticle',
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
            const response = await axios.put(`http://192.168.1.24:4000/api/v1/article/${req.id}`, req, config);
            return response.data;
        }catch (error){
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const deleteArticle = createAsyncThunk(
    'article/deleteArticle',
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
            const response = await axios.delete(`http://192.168.1.24:4000/api/v1/article/${id}`, config);
            return response.data;
        }catch (error){
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const getArticleDetails = createAsyncThunk(
    'article/getArticleDetails',
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
            const response = await axios.get(`http://192.168.1.24:4000/api/v1/article/${id}`, config);
            return response.data;
        }catch (error){
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)