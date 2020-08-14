const connection = require("../database/connection");
const { startOfDay } = require("date-fns");

module.exports = {
	async create({ username, mood }) {
		try {
			const [moodExists] = await connection("daily_mood")
				.select("*")
				.where({ username })
				.where("created_at", ">=", startOfDay(new Date()));

			if (!moodExists) {
				await connection("daily_mood").insert({ username, mood });
				console.log("inseriu");
			} else {
				await connection("daily_mood")
					.update({
						username,
						mood,
						updated_at: new Date().toLocaleString(),
					})
					.where({ username });
			}

			return true;
		} catch (error) {
			console.log(error);
			return false;
		}
	},

	async find(username) {
		try {
			const [mood] = await connection("daily_mood")
				.select("*")
				.where({ username })
				.where("created_at", ">=", startOfDay(new Date()));

			return null;
		} catch (error) {
			console.log(error);
			return null;
		}
	},
};
