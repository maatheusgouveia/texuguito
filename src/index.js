const { Client, MessageEmbed } = require("discord.js");
const { token, prefix } = require("./config/bot");
const client = new Client();
const axios = require("axios").default;
const UserController = require("./controllers/UserController");

const sentimentos = {
	1: "feliz",
	2: "neutro",
	3: "irritado",
};

client.on("ready", () => {
	console.log("Bot online");
});

client.on("message", async (msg) => {
	if (msg.content.includes(prefix)) {
		if (msg.content === `${prefix}users`) {
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
					}
				)
			);

			msg.channel.send(usersList);
		}

		if (msg.content.startsWith(`${prefix}login`)) {
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
			} catch (error) {
				msg.reply("Não consegui salvar suas credenciais");
			}
		}

		if (msg.content === `${prefix}health`) {
			msg.reply("Opa, tô aqui");
		}

		if (msg.content.startsWith(`${prefix}humor`)) {
			if (msg.content.includes("-h")) {
				return msg.reply(
					"Para definir um novo humor ou editar o existente basta utilizar o comando `!humor`, ele recebe apenas um parâmetro que deve " +
						"ser uma das opções: \n" +
						"String: feliz, neutro ou irritado \n" +
						"Inteiro 1, 2 ou 3. \n" +
						'Caso nenhum valor for informado o padrão é "neutro"'
				);
			}

			try {
				const { email, password } = await UserController.find(
					msg.author.username
				);

				if (!email || !password) {
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

				await axios
					.post("https://apiteams.goobee.com.br/api/Token", {
						usuario: email,
						senha: password,
					})
					.then(async (response) => {
						const { token, idPessoa, nome } = response.data;

						axios
							.get(
								`https://apiteams.goobee.com.br/api/Home/InformaHumor?idPessoa=${idPessoa}`,
								{
									headers: {
										authorization: `Bearer ${token}`,
									},
								}
							)
							.then(async (response) => {
								const { idSentimentoPessoa } = response.data;

								await axios.put(
									`https://apiteams.goobee.com.br/api/Home/EditarHumor/${idSentimentoPessoa}`,
									{
										idSentimentoPessoa,
										sentimento,
									},
									{
										headers: {
											authorization: `Bearer ${token}`,
										},
									}
								);

								msg.reply(
									`Já coloquei o humor ${sentimentos[sentimento]} para o usuário ${nome}`
								);
							})
							.catch(async () => {
								await axios.post(
									"https://apiteams.goobee.com.br/api/Home/AdicionarHumor",
									{
										idResponsavelCriacao:
											"c8b9b675-d918-4c8a-1c56-08d7fc19244a",
										idPessoa,
										sentimento,
									},
									{
										headers: {
											authorization: `Bearer ${token}`,
										},
									}
								);

								msg.reply(
									`Já coloquei o humor ${sentimentos[sentimento]} para o usuário ${nome}`
								);
							});
					});
			} catch (error) {
				msg.reply("Parece que algo deu errado");
			}
		}

		if (msg.content.startsWith(`${prefix}clear`)) {
			try {
				const [, qtd] = msg.content.split(" ");
				msg.channel.bulkDelete(qtd || 100);
			} catch (error) {
				console.log(error);
			}
		}
	}
});

client.login(token);
