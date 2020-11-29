const { Client } = require('discord.js');
const { token } = require('../config/bot');
const GetRandomGif = require('../services/getRandomGif');
const client = new Client();

async function planningReminder() {
	try {
		await client.login(token);

		await client.fetchApplication();

		console.log('Enviando lembrete da planning');

		const gif = await GetRandomGif.run('dont forget remember');

		const channel = client.channels.cache.find(ch => ch.name === 'teste');

		await channel.send('@everyone hoje é dia de planning');

		await channel.send(gif);

		client.destroy();
	} catch (error) {
		console.log(error);
	}
}

module.exports = planningReminder;
