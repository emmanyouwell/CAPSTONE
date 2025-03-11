const express = require('express');
const router = express.Router();
const upload = require('../utils/multer')

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');
const { allArticles, createArticle, updateArticle, deleteArticle, getArticleDetails, createHTMLArticle, updateHTMLArticle } = require('../controllers/articleController');

//Super Admin Routes
router.route('/articles')
    .get(isAuthenticatedUser, allArticles)
    .post(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), upload.single('file'), createArticle)

router.route('/html-article')
    .post(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), upload.single('image'), createHTMLArticle)
router.route('/html-article/:id')
    .put(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), upload.single('image'), updateHTMLArticle)

router.route('/article/:id')
    .get(isAuthenticatedUser, getArticleDetails)
    .put(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), updateArticle)
    .delete(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), deleteArticle)

module.exports = router;