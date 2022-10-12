require('dotenv').config()
const jwt = require('jsonwebtoken')
const usersDB = require("../models/user_model")

//function to verify jwt tokens
const verifyToken = (req, res, next) => {

    const authHeader = req.headers['authorization']
    // return 401 error if token is not valid
    if (!authHeader) return res.status(401).json({ message: "Not authenticated, please insert token!" })

    // retrieve token if auth header is present
    const token = authHeader.split(" ")[1]
    jwt.verify(token, process.env.JWT_TOKEN_KEY, (err, user) => {
        if (err) return res.status(403).json("Invalid token supplied!")
        req.user = user
        next()
    })
}

module.exports = { verifyToken } 