const express = require("express")
const morgan = require("morgan")
const server = express()
const rateLimit = require("express-rate-limit")
const helmet = require("helmet")


// setup rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    mas: 100,
    standardHeaders: true,
    legacyHeaders: false
})

const authRoutes = require("./routes/auth_routes")
const userRoutes = require("./routes/user_routes")
const walletRoutes = require("./routes/wallet_routes")

server.use(express.json())
server.use("/api/v1/auth", authRoutes)
server.use("/api/v1/user", userRoutes)
server.use("/api/v1/wallet", walletRoutes)
server.use(helmet())
server.use(morgan(':date[iso] :method :url :http-version :user-agent :status (response-time ms)'))

// apply rate limiter
server.use(limiter)

server.get("/", (req, res) => {
    return res.status(200).json({ message: "Welcome to Demo Credit!" })
});

module.exports = server