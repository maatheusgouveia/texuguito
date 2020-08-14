const { Client } = require("discord.js");
const axios = require("axios");
const { token } = require("../config/bot");
const UserController = require("../controllers/UserController");
const DailyMoodController = require("../controllers/DailyMoodController");
const client = new Client();

async function setMoodReminder() {
	await client.login(token);
	await client.fetchApplication();

	console.log("Enviando lembrete para usuários");

	const loggedUsers = await UserController.index();

	const users = client.users.cache.filter(
		(user) =>
			!!loggedUsers.find((logUser) => logUser.username === user.username)
	);

	await Promise.all(
		users.map(async (user) => {
			const moodExist = await DailyMoodController.find(user.username);
			console.log(`Enviando mensagem para ${user.username}`);
			console.log(moodExist);

			if (moodExist) {
				await user.send("Parece que você já definiu seu humor hoje...");
				await user.send("Caso mude de ideia é só me avisar");
			} else {
				const recipient = loggedUsers.find(
					(loggedUser) => user.username === loggedUser.username
				);
				await user.send(
					"Parece que você ainda não definiu o seu humor, vou colocar como neutro para você ok?"
				);
				await user.send("Caso queira mudar é só me avisar");
			}
		})
	);

	client.destroy();
}

module.exports = setMoodReminder;
