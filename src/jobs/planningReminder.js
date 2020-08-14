const { Client, DMChannel } = require("discord.js");
const axios = require("axios");
const { token } = require("../config/bot");
const client = new Client();

async function planningReminder() {
	await client.login(token);
	console.log("Enviando lembrete da planning");

	const response = await axios.get(
		"https://api.tenor.com/v1/random?q=dont%20forget%20remember&limit=1"
	);
	const gif = response.data.results[0].media[0].gif.url;

	const teste = client.channels.cache.find((ch) => ch.name === "teste");

	await teste.send("@everyone não se esqueçam da planning");
	await teste.send(gif);

	client.destroy();
}

module.exports = planningReminder;
