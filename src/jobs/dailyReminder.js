const { Client } = require("discord.js");
const { token } = require("../config/bot");
const client = new Client();
const GetRandomGif = require("../services/getRandomGif");

async function dailyReminder() {
	try {
		await client.login(token);

		await client.fetchApplication();

		console.log("Enviando lembrete da daily");

		const gif = await GetRandomGif.run("dont forget remember");

		const channel = client.channels.cache.find((ch) => ch.name === "teste");

		await channel.send("@everyone Bora pra daily");

		await channel.send(gif);

		client.destroy();
	} catch (error) {
		console.log(error);
	}
}

module.exports = dailyReminder;
