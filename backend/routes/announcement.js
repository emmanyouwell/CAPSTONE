const express = require('express');
const router = express.Router();
const upload = require('../utils/multer')

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');
const { allAnnouncements, createArticle, updateArticle, deleteArticle, getArticleDetails, createHTMLArticle, updateHTMLArticle } = require('../controllers/announcementController');

//Super Admin Routes
router.route('/announcements')
    .get(isAuthenticatedUser, allAnnouncements)
    .post(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), upload.single('file'), createArticle)

router.route('/html-announcement')
    .post(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), upload.single('image'), createHTMLArticle)
router.route('/html-announcement/:id')
    .put(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), upload.single('image'), updateHTMLArticle)

router.route('/announcement/:id')
    .get(isAuthenticatedUser, getArticleDetails)
    .put(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), updateArticle)
    .delete(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), deleteArticle)

module.exports = router;