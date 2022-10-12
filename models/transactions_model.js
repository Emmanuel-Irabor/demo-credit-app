const db = require("../config/db_config")

// add transaction
const addTransaction = transaction => {
    return db("transactions").insert(transaction, "id")
};

module.exports = { addTransaction }