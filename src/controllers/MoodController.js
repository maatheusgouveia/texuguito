const axios = require('axios').default;
const SessionController = require('./SessionController');
const { index } = require('./UserController');
const UserController = require('./UserController');

module.exports = {
	async index() {
		// TODO: https://apiteams.goobee.com.br/api/PraticaAgil/PegarCalendarioNiko/2aa9be32-b639-45f2-dc3d-08d7e1fda38a/12/2020
	},
	async create({ email, password, mood }) {
		try {
			const { token, nome, idPessoa } = await SessionController.create({
				email,
				password,
			});

			const currentMood = await axios.get(
				`https://apiteams.goobee.com.br/api/Home/InformaHumor?idPessoa=${idPessoa}`,
				{
					headers: {
						authorization: `Bearer ${token}`,
					},
				},
			);

			const { idSentimentoPessoa } = currentMood.data;

			if (idSentimentoPessoa) {
				await axios.put(
					`https://apiteams.goobee.com.br/api/Home/EditarHumor/${idSentimentoPessoa}`,
					{
						idSentimentoPessoa,
						sentimento: mood,
					},
					{
						headers: {
							authorization: `Bearer ${token}`,
						},
					},
				);
			} else {
				await axios.post(
					'https://apiteams.goobee.com.br/api/Home/AdicionarHumor',
					{
						idResponsavelCriacao:
							'c8b9b675-d918-4c8a-1c56-08d7fc19244a',
						idPessoa,
						sentimento: mood,
					},
					{
						headers: {
							authorization: `Bearer ${token}`,
						},
					},
				);
			}

			return { nome };
		} catch (error) {
			console.log(error);
			return null;
		}
	},

	async find(id) {
		try {
			const { email, password } = await UserController.find(id);

			const { token, idPessoa } = await SessionController.create({
				email,
				password,
			});

			const currentMood = await axios.get(
				`https://apiteams.goobee.com.br/api/Home/InformaHumor?idPessoa=${idPessoa}`,
				{
					headers: {
						authorization: `Bearer ${token}`,
					},
				},
			);

			return currentMood.data;
		} catch (error) {
			console.log(error);
			return null;
		}
	},
};
