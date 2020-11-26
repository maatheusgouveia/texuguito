const { Client } = require("discord.js");
const { token } = require("../config/bot");
const UserController = require("../controllers/UserController");
const MoodController = require("../controllers/MoodController");
const client = new Client();

async function setMoodReminder() {
	try {
		await client.login(token);

		await client.fetchApplication();

		console.log("Enviando lembrete para usuários");

		const loggedUsers = await UserController.index();

		const users = client.users.cache.filter(
			(user) =>
				!!loggedUsers.find(
					(logUser) => logUser.username === user.username
				)
		);

		users.map(async (user) => {
			const recipient = await UserController.find(user.username);
			console.log(recipient);

			const moodExist = await MoodController.find(recipient.username);
			console.log(`Enviando mensagem para ${user.username}`);

			if (moodExist.sentimento > 0) {
				await user.send("Parece que você já definiu seu humor hoje...");
				await user.send("Caso mude de ideia é só me avisar");
			} else {
				await MoodController.create({
					email: recipient.email,
					password: recipient.password,
					mood: 2,
				});

				await user.send(
					"Parece que você ainda não definiu o seu humor, vou colocar como neutro para você ok?"
				);
				await user.send("Caso queira mudar é só me avisar");
			}
		});

		client.destroy();
	} catch (error) {
		console.log(error);
	}
}

setMoodReminder();

module.exports = setMoodReminder;
