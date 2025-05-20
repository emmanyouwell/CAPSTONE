const Announcement = require('../models/announcement');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const cloudinary = require('cloudinary');

exports.allAnnouncements = catchAsyncErrors(async (req, res, next) => {
    const articles = await Announcement.find().sort({ createdAt: -1 });

    const count = await Announcement.countDocuments();

    res.status(200).json({
        success: true,
        count,
        articles
    })

})

exports.createHTMLArticle = catchAsyncErrors(async (req, res, next) => {
    try {
        let { content, title, description } = req.body;
        let images = [];
        // Ensure content is a valid string before processing
        content = String(content)
        if (typeof content !== "string") {
            console.error("Error: content is not a string or is undefined.");
            return;
        }
        // Extract base64 images from content
        const base64Images = content.match(/<img[^>]+src="data:image\/[^">]+"/g);

        if (base64Images) {
            for (let imgTag of base64Images) {
                const base64Data = imgTag.match(/src="(data:image\/[^"]+)"/)[1];

                // Upload image to Cloudinary
                const result = await cloudinary.uploader.upload(base64Data, {
                    folder: "articles",
                });

                images.push({
                    public_id: result.public_id,
                    url: result.secure_url
                });

                // Replace base64 image with Cloudinary URL in the content
                content = content.replace(base64Data, result.secure_url);
            }
        }

        // Save article with updated content
        const article = await Announcement.create({
            title,
            description,
            content,
            // images,
        });

        res.status(201).json({
            success: true,
            article,
        });
    } catch (error) {
        console.log("Error: ", error.message);
        next(error);
    }
})


exports.createArticle = catchAsyncErrors(async (req, res, next) => {
    try {
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

        const articles = await Announcement.create(
            req.body
        );

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
    const article = await Announcement.findById(req.params.id);
    if (!article) {
        return next(new ErrorHandler(`Article is not found with this id: ${req.params.id}`));
    }
    res.status(200).json({
        success: true,
        article
    })
})

exports.updateHTMLArticle = catchAsyncErrors(async (req, res, next) => {

    try {
        let article = await Announcement.findById(req.params.id);
        if (!article) {
            return next(new ErrorHandler('Article not found', 404));
        }
        if (req.body.title === '') {
            req.body.title = article.title;
        }

        if (req.body.description === '') {
            req.body.description = article.description;
        }


        article = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
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




exports.updateArticle = catchAsyncErrors(async (req, res, next) => {
    console.log(req.body);
    try {
        let article = await Announcement.findById(req.params.id);
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

        if (req.body.description === '') {
            req.body.description = article.description;
        }

        if (req.body.images.length === 0) {
            article = await Announcement.findByIdAndUpdate(req.params.id, {
                title: req.body.title,
                description: req.body.description,
            }, {
                new: true,
                runValidators: true,
                useFindAndModify: false,
            })
        }
        else {
            article = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true,
                useFindAndModify: false,
            })
        }


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
    const article = await Announcement.findByIdAndDelete(req.params.id);

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