const axios = require('axios');

module.exports = {
	async create({ email, password }) {
		try {
			const user = await axios.post(
				'https://apiteams.goobee.com.br/api/Token',
				{
					usuario: email,
					senha: password,
				},
			);

			return user.data;
		} catch (error) {
			console.log(error);
			return null;
		}
	},
};
