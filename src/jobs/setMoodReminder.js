const { Client } = require('discord.js');
const { token } = require('../config/bot');
const UserController = require('../controllers/UserController');
const MoodController = require('../controllers/MoodController');
const reportErrors = require('../services/reportErrors');
const client = new Client();

async function setMoodReminder() {
	try {
		await client.login(token);

		await client.fetchApplication();

		console.log('Enviando lembrete para usuários');

		const loggedUsers = await UserController.index();

		await Promise.all(
			loggedUsers.map(async user => {
				const discordUser = await client.users.fetch(user.id);

				const moodExist = await MoodController.find(user.id);
				console.log(`Enviando mensagem para ${user.username}`);

				if (moodExist.sentimento > 0) {
					await discordUser.send(
						'Parece que você já definiu seu humor hoje...',
					);
					await discordUser.send('Caso mude de ideia é só me avisar');
				} else {
					await MoodController.create({
						email: user.email,
						password: user.password,
						mood: 2,
					});

					await discordUser.send(
						'Parece que você ainda não definiu o seu humor, vou colocar como neutro para você ok?',
					);
					await discordUser.send('Caso queira mudar é só me avisar');
				}
			}),
		);

		client.destroy();
	} catch (error) {
		reportErrors(client, error);
	}
}

module.exports = setMoodReminder;
