const Sentry = require("@sentry/node");
const { Client, MessageEmbed } = require("discord.js");
const { token, prefix } = require("./config/bot");
const UserController = require("./controllers/UserController");
const MoodController = require("./controllers/MoodController");
const sentryConfig = require("./config/sentry");

const client = new Client();

Sentry.init({
	dsn: sentryConfig.sentry_dsn,
	debug: false,
});

const sentimentos = {
	1: "feliz",
	2: "neutro",
	3: "irritado",
};

try {
	client.on("ready", () => {
		console.log("Bot online");
	});

	client.on("message", async (msg) => {
		if (msg.content.includes(prefix)) {
			if (msg.content === `${prefix}users`) {
				msg.channel.startTyping();
				const users = await UserController.index();

				const usersList = new MessageEmbed()
					.setColor("#0099ff")
					.setTitle("Usuários logados")
					.setTimestamp();

				users.map(({ username, email }) =>
					usersList.addFields(
						{
							name: "Discord username",
							value: username,
							inline: true,
						},
						{
							name: "Email GooBee",
							value: email,
							inline: true,
						},
						{
							name: ".",
							value: ".",
							inline: true,
						}
					)
				);

				msg.channel.send(usersList);
				msg.channel.stopTyping();
			}

			if (msg.content.startsWith(`${prefix}login`)) {
				msg.channel.startTyping();
				try {
					if (msg.content.includes("-h")) {
						return msg.reply(
							'O comando login recebe os parâmetros "email" e "senha", respectivamente `!login texuguito@cadmus.com.br 123456`'
						);
					}

					let [, usuario, senha] = msg.content.split(" ");

					const user = await UserController.create({
						username: msg.author.username,
						email: usuario,
						password: senha,
					});

					if (user) {
						msg.reply("Já salvei suas credenciais");
					} else {
						msg.reply("Não consegui salvar suas credenciais");
					}
					msg.channel.stopTyping();
				} catch (error) {
					msg.reply("Não consegui salvar suas credenciais");
				}
			}

			if (msg.content === `${prefix}health`) {
				msg.channel.startTyping();
				msg.reply("Opa, tô aqui");
				msg.channel.stopTyping();
			}

			if (msg.content.startsWith(`${prefix}humor`)) {
				if (msg.content.includes("-h")) {
					msg.channel.startTyping();
					msg.reply(
						"Para definir um novo humor ou editar o existente basta utilizar o comando `!humor`, ele recebe apenas um parâmetro que deve " +
							"ser uma das opções: \n" +
							"String: feliz, neutro ou irritado \n" +
							"Inteiro 1, 2 ou 3. \n" +
							'Caso nenhum valor for informado o padrão é "neutro"'
					);
					msg.channel.stopTyping();
					return;
				}

				msg.channel.startTyping();
				const user = await UserController.find(msg.author.username);

				if (!user || !user.email || !user.password) {
					msg.author.send(
						"Parece que eu ainda não tenho suas credenciais do GooBee, pode me passar?"
					);
					msg.author.send(
						"O comando é `!login texuguito@cadmus.com.br 123456`, você só precisa substituir o primeiro parâmetro pelo seu email e o segundo pela sua senha"
					);
					return msg.author.send(
						"Pode ficar tranquilo porque é tudo criptografado"
					);
				}

				const { email, password } = user;

				let [, sentimento = 2] = msg.content.split(" ");

				if (typeof sentimento === "string") {
					if (sentimento === "feliz") {
						sentimento = 1;
					} else if (sentimento === "neutro") {
						sentimento = 2;
					} else if (sentimento === "irritado") {
						sentimento = 3;
					} else {
						msg.reply("Não conheço esse sentimento");
					}
				}

				const response = await MoodController.create({
					email,
					password,
					mood: sentimento,
				});

				if (response) {
					const { nome } = response;

					msg.reply(
						`Já coloquei o humor ${sentimentos[sentimento]} para o usuário ${nome}`
					);
				} else {
					msg.reply("Parece que algo deu errado");
				}

				msg.channel.stopTyping();
			}

			if (msg.content.startsWith(`${prefix}clear`)) {
				const [, qtd] = msg.content.split(" ");
				msg.channel.bulkDelete(qtd || 100);
			}
		}
	});

	client.login(token);
} catch (e) {
	Sentry.captureException(e);
}
