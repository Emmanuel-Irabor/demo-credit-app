const router = require("express").Router()
const usersDB = require("../models/user_model")
const { verifyToken } = require('../utils/verify_token')
const walletDB = require("../models/wallet_model")

router.put("/:mobileNumber", verifyToken, async (req, res) => {

    //validate request
    if (!req.body.firstName && !req.body.lastName && !req.body.email) return res.status(400).json({
        message: "Error updating. Include firstName, lastName or email..."
    })

    const mobileNumber = req.params.mobileNumber
    const newChanges = req.body

    try {
        //check if user exists
        const registeredUser = await usersDB.findByMobileNumber(req.params.mobileNumber)
        if (registeredUser.length != 0) {

            // check if phone number on registered user is same as params
            if (registeredUser[0].mobileNumber == req.params.mobileNumber) {
                // update user
                await usersDB.updateUser(mobileNumber, newChanges);
                return res.status(200).json({ message: "User updated successfully..." })
            }
        }
        return res.status(500).json({ message: "User does not exist..." })

    } catch (err) {
        res.status(500).json({ message: "Error updating user..." })
    }
})

router.delete("/:mobileNumber", verifyToken, async (req, res) => {

    if (!req.body.email) return res.status(400).json({ message: "Email required" })

    try {
        //check if user exists
        const registeredUser = await usersDB.findByMobileNumber(req.params.mobileNumber)

        if (!registeredUser) return res.status(500).json({ message: "User does not exist..." })

        if (registeredUser.length != 0) {
            // check if phone number on registered user is same as params
            if (registeredUser[0].mobileNumber == req.params.mobileNumber) {
                // delete user 
                await usersDB.removeUser(req.params.mobileNumber)

                // check if wallet with email exists
                const wallet = await walletDB.findByMobileNumber(req.params.mobileNumber)

                if (wallet.length != 0) {
                    // check if phone number on user wallet is same as params
                    if (wallet[0].userNumber == req.params.mobileNumber) {
                        // delete wallet
                        await walletDB.removeWallet(req.params.mobileNumber)

                        return res.status(200).json({ message: "User and user wallet deleted..." })
                    }
                }
            }

            return res.status(401).json({ message: "You cannot do that" })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

module.exports = router