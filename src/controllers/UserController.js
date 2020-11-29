const connection = require('../database/connection');
const Crypto = require('crypto-js');
const { secret } = require('../config/crypto');

module.exports = {
	async index() {
		const users = await connection('users').select(
			'id',
			'email',
			'username',
		);
		return users;
	},

	async create({ id, username, email, password }) {
		try {
			const [userExists] = await connection('users')
				.select('*')
				.where({ id });

			if (!userExists) {
				await connection('users').insert({
					id,
					username,
					email,
					password: Crypto.AES.encrypt(password, secret).toString(),
				});
			} else {
				await connection('users')
					.update({
						email,
						password: Crypto.AES.encrypt(
							password,
							secret,
						).toString(),
					})
					.where({ id });
			}

			return true;
		} catch (error) {
			return false;
		}
	},

	async find(id) {
		try {
			const [user] = await connection('users')
				.select('email', 'username', 'password')
				.where({ id });

			if (user) {
				const unencryptedPassword = Crypto.AES.decrypt(
					user.password,
					secret,
				);

				return {
					...user,
					password: unencryptedPassword.toString(Crypto.enc.Utf8),
				};
			}

			return null;
		} catch (error) {
			console.log(error);
			return null;
		}
	},
};
