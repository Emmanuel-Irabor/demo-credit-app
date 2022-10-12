exports.up = function (knex) {
    return knex.schema.createTable('transactions', table => {
        table.increments('id')
        table.string('recieverNumber')
        table.string('senderEmail')
        table.string('recieverEmail')
        table.string('senderNumber')
        table.uuid('transactionId').unique()
        table.integer('amount')
        table.boolean('isSuccessful')
        table.string('transactionType')
        table.timestamp('transactionTime').defaultTo(knex.fn.now())
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('transactions')
};
