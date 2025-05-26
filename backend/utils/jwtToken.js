const sendToken = (user, statusCode, req, res) => {
    const token = user.getJwtToken();

    const isMobile = req.headers['x-client-type'] === 'mobile';

    if (isMobile) {
        // Return token in response (for mobile clients)
        res.setHeader('Authorization', `Bearer ${token}`);
        res.status(statusCode).json({
            success: true,
            token,
            user
        });
    } else {
        // Set token as httpOnly cookie (for web clients)
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // set to true in production with HTTPS
            sameSite: 'Strict',
            maxAge: 15 * 60 * 1000 // 15 mins
        });

        res.status(statusCode).json({
            success: true,
            user
        });
    }
};

module.exports = sendToken