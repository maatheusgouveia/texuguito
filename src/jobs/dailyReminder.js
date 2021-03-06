const { Client } = require('discord.js');
const { token } = require('../config/bot');
const client = new Client();
const GetRandomGif = require('../services/getRandomGif');
const reportErrors = require('../services/reportErrors');

async function dailyReminder() {
	try {
		await client.login(token);

		await client.fetchApplication();

		console.log('Enviando lembrete da daily');

		const gif = await GetRandomGif.run('times up');

		const channel = client.channels.cache.find(ch => ch.name === 'teste');

		await channel.send('@everyone Bora pra daily');

		await channel.send(gif);

		client.destroy();
	} catch (error) {
		reportErrors(client, error);
	}
}

module.exports = dailyReminder;
