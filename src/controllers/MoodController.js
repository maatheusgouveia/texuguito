const axios = require("axios").default;

module.exports = {
	async create({ email, password, mood }) {
		try {
			const user = await axios.post(
				"https://apiteams.goobee.com.br/api/Token",
				{
					usuario: email,
					senha: password,
				}
			);

			const { token, nome, idPessoa } = user.data;

			const currentMood = await axios.get(
				`https://apiteams.goobee.com.br/api/Home/InformaHumor?idPessoa=${idPessoa}`,
				{
					headers: {
						authorization: `Bearer ${token}`,
					},
				}
			);

			const { idSentimentoPessoa } = currentMood.data;

			const updatedMood = await axios.put(
				`https://apiteams.goobee.com.br/api/Home/EditarHumor/${idSentimentoPessoa}`,
				{
					idSentimentoPessoa,
					sentimento: mood,
				},
				{
					headers: {
						authorization: `Bearer ${token}`,
					},
				}
			);

			if (!updatedMood.data) {
				const newMood = await axios.post(
					"https://apiteams.goobee.com.br/api/Home/AdicionarHumor",
					{
						idResponsavelCriacao:
							"c8b9b675-d918-4c8a-1c56-08d7fc19244a",
						idPessoa,
						sentimento: mood,
					},
					{
						headers: {
							authorization: `Bearer ${token}`,
						},
					}
				);
			}

			return { nome };
		} catch (error) {
			return null;
		}
	},
};
