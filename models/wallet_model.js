const db = require("../config/db_config")

// add a wallet
const addWallet = wallet => {
    return db("wallets").insert(wallet, "id")
};

// find single wallet
const findWalletByEmail = email => {
    return db('wallets').where("userEmail", email)
}

// get specific wallet by mobile number
const findByMobileNumber = mobileNumber => {
    return db("wallets")
        .where("userNumber", mobileNumber)
};

// update wallet balance
const updateWalletBalance = (amountToFund, userEmail) => {
    return db('wallets')
        .where("userEmail", userEmail)
        .update("accountBalance", amountToFund)
}

// remove wallet
const removeWallet = mobileNumber => {
    return db("wallets")
        .where("userNumber", mobileNumber)
        .del()
};

module.exports = {
    addWallet,
    removeWallet,
    updateWalletBalance,
    findWalletByEmail,
    findByMobileNumber
}