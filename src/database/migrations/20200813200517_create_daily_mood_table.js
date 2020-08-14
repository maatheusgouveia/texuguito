exports.up = function (knex) {
	return knex.schema.createTable("daily_mood", function (table) {
		table.increments("id");
		table.integer("mood");
		table.string("username");
		table.datetime("created_at").defaultTo(knex.fn.now());
		table.datetime("updated_at");
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable("daily_mood");
};
