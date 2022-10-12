const router = require("express").Router()
const walletDB = require("../models/wallet_model")
const { verifyToken } = require('../utils/verify_token')
const transactionDB = require("../models/transactions_model")
const { v4: uuidv4 } = require('uuid')

router.post("/deposit", verifyToken, async (req, res) => {

    //validate request
    if (!req.body.email) return res.status(400).json({ message: "Email missing" })
    if (!req.body.amountToFund) return res.status(400).json({ message: "Amount to fund required" })

    try {

        //get current account balance
        const wallet = await walletDB.findWalletByEmail(req.body.email)
        
        if (wallet) {
            const accountBalance = wallet[0].accountBalance

            // add current balance and amount to fund 
            const amountToFund = parseFloat(req.body.amountToFund)
            const newBalance = parseFloat(accountBalance) + amountToFund

            //save new balance to user wallet
            const updatedWallet = await walletDB.updateWalletBalance(newBalance, req.body.email)

            //save transaction 
            const transaction = {
                senderEmail: req.body.email,
                senderNumber: wallet[0].userNumber,
                transactionId: uuidv4(),
                amount: amountToFund,
                isSuccessful: true,
                transactionType: "Fund wallet"
            }

            //save transactions to database
            await transactionDB.addTransaction(transaction)

            // save if wallet is updated
            if (updatedWallet) {
                return res.status(200).json({
                    message: "Transaction successful..",
                    Balance: `${newBalance}`
                })
            }
            return res.status(500).json({ message: "Error occured... Transaction failed" })
        }
        return res.status(500).json({ message: "Wallet not found " })

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

})

router.post("/transfer", verifyToken, async (req, res) => {

    //validate request
    if (!req.body.senderEmail) return res.status(400).json({ message: "Sender email missing" })
    if (!req.body.amountToTransfer) return res.status(400).json({ message: "Amount to transfer required" })
    if (!req.body.recieverEmail) return res.status(400).json({ message: "Reciever email missing" })

    // check if sender wallet exists
    const senderWallet = await walletDB.findWalletByEmail(req.body.senderEmail)
    if (senderWallet) {

        //search for wallet of reciever
        const recieverWallet = await walletDB.findWalletByEmail(req.body.recieverEmail)
        if (recieverWallet) {

            const senderBalanceBeforeTransfer = senderWallet[0].accountBalance
            const recieverBalanceBeforeTransfer = recieverWallet[0].accountBalance
            const amountToTransfer = req.body.amountToTransfer

            //check if sender has enough money to send
            if (senderBalanceBeforeTransfer < amountToTransfer) return res.status(400).json({ message: "Insufficient balance..." })

            //deduct fund from sender account
            const senderBalanceAfterTransfer = senderBalanceBeforeTransfer - amountToTransfer

            // send fund to reciever account
            const recieverBalanceAfterTransfer = recieverBalanceBeforeTransfer + amountToTransfer

            // update sender account
            await walletDB.updateWalletBalance(senderBalanceAfterTransfer, req.body.senderEmail)

            //update reciever account
            await walletDB.updateWalletBalance(recieverBalanceAfterTransfer, req.body.recieverEmail)


            //save transaction 
            const transaction = {
                senderEmail: req.body.senderEmail,
                recieverEmail: req.body.recieverEmail,
                senderNumber: senderWallet[0].userNumber,
                recieverNumber: recieverWallet[0].userNumber,
                transactionId: uuidv4(),
                amount: amountToTransfer,
                isSuccessful: true,
                transactionType: "Transfer"
            }

            //save transactions to database
            await transactionDB.addTransaction(transaction)


            return res.status(200).json({
                message: "Transfer successful...",
                Balance: `${senderBalanceAfterTransfer}`
            })
        }
        return res.status(500).json({ message: "Reciever's wallet not found..." })
    }
    return res.status(500).json({ message: "Sender Wallet not found..." })
})

router.post("/withdraw", verifyToken, async (req, res) => {

    //validate request
    if (!req.body.email) return res.status(400).json({ message: "Email missing" })
    if (!req.body.amountToWithdraw) return res.status(400).json({ message: "Amount to withdraw required" })

    try {
        //check if wallet exists
        const wallet = await walletDB.findWalletByEmail(req.body.email)
        if (wallet) {
            //get wallet balance
            const walletBalance = wallet[0].accountBalance
            const amountToWithdraw = req.body.amountToWithdraw

            // check if balance is greater than amount to withdraw
            if (walletBalance > amountToWithdraw) {
                // calculate balance after withdrawal
                const balanceAfterWithdrawal = walletBalance - amountToWithdraw

                //update wallet balance
                const walletAfterWithdrawal = await walletDB.updateWalletBalance(balanceAfterWithdrawal, req.body.email)

                //save transaction 
                const transaction = {
                    senderEmail: req.body.email,
                    senderNumber: wallet[0].userNumber,
                    transactionId: uuidv4(),
                    amount: amountToWithdraw,
                    isSuccessful: true,
                    transactionType: "Withdrawal"
                }

                //save transactions to database
                await transactionDB.addTransaction(transaction)

                if (walletAfterWithdrawal) {
                    return res.status(200).json({
                        message: `${amountToWithdraw} withdrawn`,
                        balance: `New balance ${balanceAfterWithdrawal}`
                    })
                }
                return res.status(400).json({ message: "Insufficient balance..." })
            }

            return res.status(500).json({ message: "Wallet not found..." })
        }


    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

})

router.post("/balance", verifyToken, async (req, res) => {

    //validate request
    if (!req.body.email) return res.status(400).json({ message: "Email missing" })

    try {
        const wallet = await walletDB.findWalletByEmail(req.body.email)
        const walletBalance = parseFloat(wallet[0].accountBalance)

        return res.status(200).json({ message: `Account balance : ${walletBalance}` })

    } catch (err) {
        return res.status(500).json({ message: "Wallet not found..." })
    }

})

module.exports = router