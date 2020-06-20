exports.up = function (knex) {
	return knex.schema.createTable("users", function (table) {
		table.string("username").primary();
		table.string("email").notNullable();
		table.string("password").notNullable();
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable("users");
};
