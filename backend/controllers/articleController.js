const Article = require('../models/articles');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const cloudinary = require('cloudinary');

exports.allArticles = catchAsyncErrors(async (req, res, next) => {
    const articles = await Article.find();

    const count = await Article.countDocuments();

    res.status(200).json({
        success: true,
        count,
        articles
    })

})

exports.createArticle = catchAsyncErrors(async (req, res, next) => {
    try {
        console.log(req.file);
        const filePath = req.file;

        let text = '';
        if (req.file.mimetype === 'application/pdf') {
            const pdfParser = require('pdf-parse');
            const data = await pdfParser(fs.readFileSync(filePath));
            text = data.text;
        } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const mammoth = require('mammoth');
            const data = await mammoth.extractRawText({ path: filePath });
            text = data.value;
        }

        let images = []
        if (typeof req.body.images === 'string') {
            images.push(req.body.images)
        }
        else {
            images = req.body.images
        }

        let imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: 'articles'
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            });
        }
        req.body.images = imagesLinks;

        const articles = await Article.create({
            title: req.body.title,
            images: req.body.images,
            description: text,
        });

        res.status(201).json({
            success: true,
            articles,
        });
    }
    catch (error) {
        console.log('Error: ', error.message);
        next(error);
    }
})

exports.getArticleDetails = catchAsyncErrors(async (req, res, next) => {
    const article = await Article.findById(req.params.id);
    if (!article) {
        return next(new ErrorHandler(`Article is not found with this id: ${req.params.id}`));
    }
    res.status(200).json({
        success: true,
        article
    })
})

exports.updateArticle = catchAsyncErrors(async (req, res, next) => {
    console.log(req.body);
    try {
        let article = await Article.findById(req.params.id);
        if (!article) {
            return next(new ErrorHandler('Article not found', 404));
        }
        let images = [];
        if (Array.isArray(req.body.images)) {
            images = req.body.images.map(image => typeof image === 'object' && image.url ? image.url : image);
        }
        else if (typeof req.body.images === 'string') {
            images.push(req.body.images);
        }

        if (images.length > 0) {
            for (let i = 0; i < article.images.length; i++) {
                await cloudinary.v2.uploader.destroy(article.images[i].public_id);
            }
            let imagesLinks = [];
            for (let i = 0; i < images.length; i++) {
                const result = await cloudinary.v2.uploader.upload(images[i], {
                    folder: 'articles',
                });
                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                })
            }
            req.body.images = imagesLinks
        }
        article = await Article.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        })

        res.status(200).json({
            success: true,
            article
        })
    } catch (error) {
        console.log('Error: ', error.message);
        next(error);
    }
})


exports.deleteArticle = catchAsyncErrors(async (req, res, next) => {
    const article = await Article.findByIdAndDelete(req.params.id);

    if (!article) {
        return next(new ErrorHandler(`Article is not found with this id: ${req.params.id}`))
    }
    for (let i = 0; i < article.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(article.images[i].public_id)
    }

    res.status(200).json({
        success: true,
        message: 'Article is deleted'
    })
})