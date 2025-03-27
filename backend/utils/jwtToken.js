const sendToken = (user, statusCode, res) => {
    console.log(user);

    // Create JWT token
    const token = user.getJwtToken();

    // Set the JWT token in the Authorization header as Bearer
    res.setHeader('Authorization', `Bearer ${token}`);

    // Return success and user data in the response
    res.status(statusCode).json({
        success: true,
        token,
        user // Send user data in the response body 
    });
}

module.exports = sendToken;
