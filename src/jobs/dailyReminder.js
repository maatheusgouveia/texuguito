const { Client, DMChannel } = require("discord.js");
const axios = require("axios");
const { token } = require("../config/bot");
const client = new Client();

async function dailyReminder() {
	await client.login(token);
	await client.fetchApplication();

	console.log("Enviando lembrete da daily");

	const response = await axios.get(
		"https://api.tenor.com/v1/random?q=times%20up&limit=1"
	);
	const gif = response.data.results[0].media[0].gif.url;

	const teste = client.channels.cache.find((ch) => ch.name === "teste");

	await teste.send("@everyone Bora pra daily");
	await teste.send(gif);

	client.destroy();
}

module.exports = dailyReminder;
