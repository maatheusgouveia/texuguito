const { Client, DMChannel } = require("discord.js");
const axios = require("axios");
const { token } = require("../config/bot");
const UserController = require("../controllers/UserController");
const client = new Client();

async function setMoodReminder() {
	await client.login(token);
	console.log("Enviando lembrete para usuários");

	const loggedUsers = await UserController.index();

	const users = client.users.cache.filter(
		(user) =>
			!!loggedUsers.find((logUser) => logUser.username === user.username)
	);

	await Promise.all(
		users.map(async (user) => {
			await user.send("Já atualizou seu humor hoje?");
		})
	);

	client.destroy();
}

module.exports = setMoodReminder;
