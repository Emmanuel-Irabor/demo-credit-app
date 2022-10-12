exports.up = function (knex) {
    return knex.schema.createTable('wallets', table => {
        table.increments('id')
        table.string('userEmail').unique()
        table.string('userNumber').unique()
        table.float('accountBalance')
        table.uuid('accountId').unique()
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('user_accounts')
};
