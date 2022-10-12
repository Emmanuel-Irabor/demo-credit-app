exports.up = function (knex) {
    return knex.schema.createTable('users', table => {
        table.increments('id').primary()
        table.string('firstName')
        table.string('lastName')
        table.string('email').unique()
        table.string('password')
        table.string('mobileNumber').unique()

    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('users')
};
