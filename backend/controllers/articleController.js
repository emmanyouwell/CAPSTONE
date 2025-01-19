const Article = require('../models/articles');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const cloudinary = require('cloudinary');

exports.allArticles = catchAsyncErrors(async(req,res, next)=> {
    const articles = await Article.find();

    const count = await Article.countDocuments();

    res.status(200).json({
        success: true,
        count,
        articles
    })

})