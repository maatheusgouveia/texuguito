const connection = require("../database/connection");
const Crypto = require("crypto-js");
const { secret } = require("../config/crypto");

module.exports = {
	async index() {
		const users = await connection("users").select("email", "username");
		return users;
	},

	async create({ username, email, password }) {
		try {
			const [userExists] = await connection("users")
				.select("*")
				.where({ username });

			if (!userExists) {
				await connection("users").insert({
					username,
					email,
					password: Crypto.AES.encrypt(password, secret).toString(),
				});
			} else {
				const user = await connection("users")
					.update({
						email,
						password: Crypto.AES.encrypt(
							password,
							secret
						).toString(),
					})
					.where({ username });
			}

			return true;
		} catch (error) {
			return false;
		}
	},

	async find(username) {
		try {
			const [user] = await connection("users")
				.select("email", "username", "password")
				.where({ username });

			if (user) {
				const unencryptedPassword = Crypto.AES.decrypt(
					user.password,
					secret
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
