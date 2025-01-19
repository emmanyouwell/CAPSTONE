const express = require('express');
const router = express.Router();

const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/auth');
const { allArticles, createArticle, updateArticle, deleteArticle, getArticleDetails } = require('../controllers/articleController');

//Super Admin Routes
router.route('/articles')
    .get(isAuthenticatedUser, allArticles)
    .post(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), createArticle)

router.route('/article/:id')
    .get(isAuthenticatedUser, getArticleDetails)
    .put(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), updateArticle)
    .delete(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), deleteArticle)

module.exports = router;