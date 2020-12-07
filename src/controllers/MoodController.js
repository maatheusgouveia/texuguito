const axios = require('axios').default;
const SessionController = require('./SessionController');
const UserController = require('./UserController');

module.exports = {
	async index({
		email,
		password,
		day = new Date().getDate(),
		month = new Date().getMonth() + 1,
		year = new Date().getFullYear(),
	}) {
		try {
			const { token } = await SessionController.create({
				email,
				password,
			});

			const response = await axios.get(
				`https://apiteams.goobee.com.br/api/PraticaAgil/PegarCalendarioNiko/2aa9be32-b639-45f2-dc3d-08d7e1fda38a/${month}/${year}`,
				{
					headers: {
						authorization: `bearer ${token}`,
					},
				},
			);

			const list = response.data.map(data => {
				const { sentimento } = data.sentimentoDias.find(
					({ dia }) => dia === day,
				);

				return { sentimento, nome: data.nomePessoa, dia: day };
			});

			return list;
		} catch (error) {
			console.log(error);
			return [];
		}
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
