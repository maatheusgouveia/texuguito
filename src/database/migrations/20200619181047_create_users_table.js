exports.up = function (knex) {
	return knex.schema.createTable("users", function (table) {
		table.string("id").primary();
		table.string("username");
		table.string("email").notNullable();
		table.string("password").notNullable();
		table.datetime("created_at").defaultTo(knex.fn.now());
		table.datetime("updated_at");
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable("users");
};
