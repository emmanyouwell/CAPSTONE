import { createSlice } from '@reduxjs/toolkit';
import { getArticles, addArticles, updateArticle, getArticleDetails, deleteArticle } from '../actions/articleActions';

export const articleSlice = createSlice({
    name: 'article',
    initialState: {
        articles: [],
        loading: false,
        error: null,
        articleDetails: {},
        isUpdated: false,
        isDeleted: false,
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getArticles.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getArticles.fulfilled, (state, action) => {
                state.loading = false;
                state.articles = action.payload.articles;
            })
            .addCase(getArticles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addArticles.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(addArticles.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.success;
            })
            .addCase(addArticles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateArticle.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(updateArticle.fulfilled, (state, action) => {
                state.loading = false;
                state.isUpdated = action.payload.success;
            })
            .addCase(updateArticle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getArticleDetails.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getArticleDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.articleDetails = action.payload.article;
            })
            .addCase(getArticleDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteArticle.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(deleteArticle.fulfilled, (state, action) => {
                state.loading = false;
                state.isDeleted = action.payload.success;
            })
            .addCase(deleteArticle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})

export default articleSlice.reducer;